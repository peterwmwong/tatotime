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
    gzip "$tatotime_shows_bydate([#{jsonObj}]);", (gzerr,gzjson)->
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
  makeDate = (d)->
    month = switch d.getMonth()
      when 0 then 'Jan'
      when 1 then 'Feb'
      when 2 then 'Mar'
      when 3 then 'Apr'
      when 4 then 'May'
      when 5 then 'Jun'
      when 6 then 'Jul'
      when 7 then 'Aug'
      when 8 then 'Sep'
      when 9 then 'Oct'
      when 10 then 'Nov'
      when 11 then 'Dec'
    "#{d.getDate()}/#{month}/#{d.getFullYear()}"

  (s, sdate, done)->
    if (airdate = db[s.sid]?[s.ep])?
      done undefined, airdate != (mdate = makeDate(sdate))
    else
      opts =
        host: 'services.tvrage.com'
        port: 80
        path: "/tools/quickinfo.php?sid=#{s.sid}&ep=#{s.ep}"
      cb = (res)-> res.on 'data', (data)->
        match = airDateRegex.exec data
        edb = db[s.sid] or (db[s.sid] = {})
        done undefined, (edb[s.ep] = match?[1]) != makeDate(sdate)
      http.get(opts,cb).on 'error', done

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
        for day in result.DAY
          writeJson = do->
            date = new Date day['@'].attr
            name = "#{date.getFullYear()}-#{date.getMonth()+1}-#{date.getDate()}"
            (data)-> putjson name, data
          jsonResult = [""]
          dayParsed = [false]
          waiting = [0]

          for t in [].concat day.time
            if (d = new Date "#{day['@'].attr} #{t['@'].attr} EST").getHours()>=20
              d.setHours d.getHours()-1 # EST -> CST
              for s in [].concat t.show
                waiting[0]++
                isRerun s, d, do(d,s,writeJson,jsonResult,dayParsed,waiting)-> (e,rerun)->
                  waiting[0]--
                  if jsonResult[0].length > 0
                    jsonResult[0] += ','
                  jsonResult[0] += JSON.stringify
                    sid: s.sid
                    title: s['@'].name
                    eptitle: s.title
                    rerun: rerun
                    ep:s.ep
                    network:s.network
                    datetime:d

                  if dayParsed[0] and waiting[0] == 0
                    writeJson jsonResult[0]
          dayParsed[0] = true
      catch ex
        L "Exception: ",ex?.stack
      return

    res.on 'data', (data)-> parser.parseBuffer data, false
    res.on 'end', -> parser.parseBuffer emptyBuf, true

