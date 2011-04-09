define ->
  toDateTime = (d)->
    d = new Date d
    "#{d.getUTCFullYear()}-#{d.getUTCMonth()+1}-#{d.getUTCDate()} #{d.getUTCHours()}:#{d.getUTCMinutes()}:#{d.getUTCSeconds()}"

  getShows: (from,to,done)->
    #TODO convert from and to UTC
    done [
      {date:'2011-04-04', shows: [
        {title:'Nikita', datetime:'2011-04-04 20:30:00', network: 'CW'},
        {title:'Hellcats', datetime:'2011-04-04 21:30:00', network: 'CW'}
      ]},
      {date:'2011-04-05', shows: [
        {title:'The Event', datetime:'2011-04-05 21:00:00', network: 'NBC'},
        {title:'The Vampire Diaries slkdjflksdjf sldkfjls dflkjfdlkj sldkfj slkfjl sldkfj', datetime:'2011-04-05 22:00:00', network: 'CW'}
      ]},
      {date:'2011-04-05', shows: [
        {title:'Entourage', datetime:'2011-04-06 22:00:00', network: 'HBO'},
        {title:'True Blood', datetime:'2011-04-06 23:30:00', network: 'HBO'}
      ]}
    ]

