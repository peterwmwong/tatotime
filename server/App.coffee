Client = require('mysql').Client
client = new Client()
client.user = 'root'
client.password = 'tatotime'
client.connect()
client.query 'USE tatotime'

app = (express = require 'express').createServer()
toDateTime = (d)->
  "#{d.getFullYear()}-#{d.getMonth()+1}-#{d.getDate()} #{d.getHours()}:#{d.getMinutes()}:#{d.getSeconds()}"

R = (cb,o)->"#{cb}(#{JSON.stringify o});"

app.get '/shows', (req,res)->
  {callback,from,to} = req.query
  from = new Date from
  to = new Date to
  if from? and to?
    query = "SELECT title,network,datetime FROM showInfo where datetime between '#{toDateTime from}' and '#{toDateTime to}'"
    client.query query, (err,results,fields)->
      if err?
        res.end R callback, sqlError: err
      else
        res.end R callback, results
  else
    res.end R callback, error: 'from and/or to date are invalid Date Time string(s)'

app.listen 8080
