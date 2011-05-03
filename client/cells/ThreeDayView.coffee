define ['data/ShowService','C!shared/cattable/CatTable'], (ShowService,CatTable)->

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
        # Get and Sort (reruns below) members
        getMembers: (cat)-> tsmap[cat].sort (a,b)->
          if a.rerun == b.rerun then 0
          else if b.rerun then 1
          else -1
        memberCell: C.extend
          'render <div class="member">': (R)->
            R @options.columns, (col)=>
              "<div class='col #{col} #{R @model.rerun and 'rerun'}'>#{@model[col]}</div>"
