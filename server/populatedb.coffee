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
insertQuery = "INSERT INTO showInfo SET sid=?, title=?, isRerun=?, ep=?, network=?, datetime=?"

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
          for t in [].concat day.time
            d = new Date "#{day['@'].attr} #{t['@'].attr}"
            for s in [].concat t.show
              title = s['@'].name
              client.query insertQuery,
                [s.sid, title, false, s.ep, s.network,"#{d.getFullYear()}-#{d.getMonth()}-#{d.getDate()} #{d.getHours()}:#{d.getMinutes()}:#{d.getSeconds()}"]
              L "#{d} #{title}"
      catch ex
        L "Exception: ",ex
      finally
        client.end()

    res.on 'data', (data)-> parser.parseBuffer data, false
    res.on 'end', -> parser.parseBuffer emptyBuf, true

