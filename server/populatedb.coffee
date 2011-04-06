http = require 'http'
xml2js = require 'xml2js-expat'
sys = require 'sys'

Client = require('mysql').Client
client = new Client()
client.user = 'root'
client.password = 'tatotime'
client.connect()

client.query 'USE tatotime'

L = console.log.bind console
E = console.error.bind console
emptyBuf = new Buffer ""

L "--- Populating the database ---"

http.get
  host: 'services.tvrage.com'
  port: 80
  path: '/feeds/fullschedule.php?country=US'

  (res)->
    parser = new xml2js.Parser()

    parser.addListener 'end', (result,err)->
      if err then return E 'ERROR: ', err
      try
        for day in result.DAY
          _d = day['@'].attr
          for t in [].concat day.time
            _t = t['@'].attr
            for s in [].concat t.show
              title = s['@'].name
              d = new Date("#{_d} #{_t}")
              tsString = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()
              client.query "INSERT INTO showInfo SET sid=?, title=?, isRerun=?, ep=?, network=?, datetime=?", [
                s.sid, title, false, s.ep, s.network, tsString
              ]
              L "#{_d} #{_t} #{title}"
      catch ex
        L "Exception: ",ex
      finally
        client.end()
      return

    res.on 'data', (data)-> parser.parseBuffer data, false
    res.on 'end', -> parser.parseBuffer emptyBuf, true

