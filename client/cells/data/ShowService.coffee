define ['require'], (require)->

  baseUrl = 'http://tatotime_showinfo_dev.s3.amazonaws.com/shows/bydate/'

  toDate = (d)->
    "#{d.getFullYear()}-#{d.getMonth()+1}-#{d.getDate()}"

  getTime = (ts)->
    d = new Date ts
    isPM = d.getHours() > 11
    hours = if isPM then d.getHours()-12 else d.getHours()
    minutes = d.getMinutes()
    if minutes < 10
      minutes = '0'+minutes
    "#{hours}:#{minutes}"

  getShowsForDate: (date,done)->
    require ["#{baseUrl}#{toDate date}.json"], (day)->
      tsmap = {}
      for s in day.shows
        (tsmap[getTime s.datetime] ?= []).push s
      done tsmap

