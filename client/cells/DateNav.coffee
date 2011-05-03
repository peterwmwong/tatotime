DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

define ['C!shared/cattable/CatTable','data/ShowService'], (CatTable,ShowService)->
  render: (R)->
    ShowService.getWeekSchedule (dayShowsMap)->
      days = {}
      for day of dayShowsMap
        days[day] = day

      R.async R CatTable, do->
        categories: days
        columns: ['date','shows']
        getMembers: (day)-> dayShowsMap[day]
        categoryCell: C.extend
          'render <div class="dateDay">': (R)->
            d = new Date @options.category
            isEven = false
            """
            <div class='date'>#{d.getDate()}</div>
            <div class='day'>#{DAYS[d.getDay()]}</div>
            """
        memberCell: C.extend
          'render <div class="member">': (R)->
            d = new Date @model.time
            """
            <div class='timeslot'>
              <div class='time'>#{(hours = d.getHours())>12 and (hours-12) or hours}:#{(min = d.getMinutes())<10 and "0#{min}" or min}</div>
              <div class='shows'>
                #{R @model.shows, (show)->"
                  <div class='show'>#{show.name}</div>
                "}
              </div>
            </div>
            """

  bind:
    'click .category': (e)->
      @$('.category.selected').removeClass 'selected'
      $(e.target).parents('.category').andSelf().first().addClass 'selected'
      return false
