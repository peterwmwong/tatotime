define ['require'], (require)->

  baseUrl = 'http://tatotime.s3.amazonaws.com/shows/bydate/'

  toDate = (d)->
    "#{d.getFullYear()}-#{d.getMonth()+1}-#{d.getDate()}"

  getShowsForDate: (date,done)->
    require ["#{baseUrl}#{toDate date}.json"], done

