fs = require 'fs'
gzip = require 'gzip'
L = console.log.bind console
E = console.error.bind console

if typeof process.argv[2] != 'string'
  E "Must supply JSON file containing Amazon S3 info (key, secret, bucket)"
  process.exit()

putjson = do->
  client = require('knox').createClient JSON.parse fs.readFileSync process.argv[2], 'ascii'
  (name,jsonObj)->
    gzip "define(#{JSON.stringify jsonObj});", (gzerr,gzjson)->
      req = client.put "/shows/bydate/#{name}.json",
        'Content-Length': gzjson.length
        'Content-Type': 'application/javascript'
        'Content-Encoding': 'gzip'
      req.on 'response', (res)-> L "PUT [#{res.statusCode}] #{req.url}"
      req.end gzjson

http = require 'http'
xml2js = require 'xml2js-expat'
emptyBuf = new Buffer ""

isRerun = do->
  db = {}
  airDateRegex = /Episode Info\@.*\^(.*)/
  (s, sdate, done)->
    sdate = new Date(sdate.getFullYear(),sdate.getMonth(),sdate.getDate())
    if (airdate = db[s.sid]?[s.ep])?
      done undefined, airdate < sdate.valueOf()
    else
      opts =
        host: 'services.tvrage.com'
        port: 80
        path: "/tools/quickinfo.php?sid=#{s.sid}&ep=#{s.ep}"
      cb = (res)->
        qidata = ""
        res.on 'data', (data)-> qidata += data.toString()
        res.on 'end', ->
          match = airDateRegex.exec qidata
          edb = db[s.sid] or (db[s.sid] = {})
          datems = new Date(match?[1]).valueOf()
          done undefined, isNaN(datems) and false or (edb[s.ep] = datems) < sdate.valueOf()
      http.get(opts,cb).on 'error', done

normalizeTime = do->
  r = /^0?(\d+:\d+) (am|pm)$/
  (timeString)->
    r.exec(timeString)?[1]

showComparator = ({title:a},{title:b})->
    if a < b then -1
    else if a > b then 1
    else 0

L "--- Downloading full schedule ---"
http.get
  host: 'services.tvrage.com'
  port: 80
  path: '/feeds/fullschedule.php?country=US'

  (res)->
    parser = new xml2js.Parser()

    parser.addListener 'end', (result,err)->
      L "--- Parsing full schedule ---"
      if err then return E 'ERROR: ', err
      try
        for day in result.DAY then do->
          writeJson = do->
            date = new Date day['@'].attr
            name = "#{date.getFullYear()}-#{date.getMonth()+1}-#{date.getDate()}"
            (data)-> putjson name, data
          dayResults = {}
          dayParsed = false
          waiting = 0

          for t in [].concat day.time
            if (d = new Date "#{day['@'].attr} #{time = t['@'].attr} EST").getHours()>=20
              dayResults[normalizeTime(time)] = (timeResults = [])
              d.setHours d.getHours()-1 # EST -> CST
              for s in [].concat t.show
                waiting++
                isRerun s, d, do(d,s,timeResults)-> (e,rerun)->
                  waiting--
                  if e? then E "!!! Error determining rerun for show: '#{s['@'].name}', ep: '#{s.ep}'"
                  else
                    timeResults.push
                      sid: s.sid
                      title: s['@'].name
                      eptitle: s.title
                      rerun: rerun
                      ep:s.ep
                      network:s.network

                  if dayParsed and waiting == 0
                    # Sort shows
                    for k,shows of dayResults
                      shows.sort showComparator
                    writeJson dayResults
          dayParsed = true
      catch ex
        E "!!! Error parsing full schedule: ",ex?.stack or ex
      return

    res.on 'data', (data)-> parser.parseBuffer data, false
    res.on 'end', -> parser.parseBuffer emptyBuf, true

