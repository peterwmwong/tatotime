cell.define ['data/ShowService','shared/cattable/CatTable'], (ShowService,CatTable)->

  msInDay = 1000*60*60*24
  today = new Date()
  yesterday= new Date today.valueOf() - msInDay
  tomorrow = new Date today.valueOf() + msInDay

  render: (R)->
    ShowService.getShowsForDate today,(tsmap)->
      timeslots = {}
      for ts,v of tsmap
        timeslots[ts] = ts
      R.async R CatTable,
        class: 'day'
        title: 'Today'
        categories: timeslots
        columns: ['network','title']
        getMembers: (cat,model)->tsmap[cat]

