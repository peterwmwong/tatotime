define ['require'], (require)->

  baseUrl = 'http://tatotime.s3.amazonaws.com/shows/bydate/'

  toDate = (d)->
    "#{d.getFullYear()}-#{d.getMonth()+1}-#{d.getDate()}"

  getShowsForDate: (date,done)->
    require ["#{baseUrl}#{toDate date}.json"], done

  getWeekSchedule: (done)->
    time = (t, shows...)->
      time: t
      shows:shows

    show = (name)->
      name: name

    done
      "2011-05-01T00:04:40.497Z": [
        time "2011-05-01T01:00:00.000Z",
          show 'The Vampire Diaries'
        time "2011-05-01T02:00:00.000Z",
          show 'Big Bang Theory'
          show 'The Killing'
      ]
      "2011-05-02T00:04:40.497Z": [
        time "2011-05-02T00:00:00.000Z",
          show 'Mad Men'
        time "2011-05-02T02:00:00.000Z",
          show 'Nova'
          show 'The Event'
      ]
      "2011-05-03T00:04:40.497Z": [
        time "2011-05-03T01:30:00.000Z",
          show 'The Borgias'
      ]

      "2011-05-04T00:04:40.497Z": [
        time "2011-05-04T00:00:00.000Z",
          show 'Game of Thrones'
      ]

      "2011-05-05T00:04:40.497Z": [
        time "2011-05-04T00:00:00.000Z",
          show 'Frontline'
      ]

      "2011-05-06T00:04:40.497Z": [
        time "2011-05-04T02:30:00.000Z",
          show 'Camelot'
      ]

      "2011-05-07T00:04:40.497Z": [
        time "2011-05-04T00:00:00.000Z",
          show 'Outsourced'
      ]

