cell.define ['data/ShowService'], (ShowService)->

  msInDay = 1000*60*60*24
  today = new Date()
  yesterday= new Date today.valueOf() - msInDay
  tomorrow = new Date today.valueOf() + msInDay

  getTime = (ts)->
    d = new Date ts
    isPM = d.getHours() > 11
    hours = if isPM then d.getHours()-12 else d.getHours()
    minutes = d.getMinutes()
    if minutes < 10
      minutes = '0'+minutes
    "#{hours}:#{minutes} <span class='ampm'>#{if isPM then "PM" else "AM"}</span>"

  render: (R)->
    ShowService.getShowsForDate today,(shows)->
      R.async "
        <div class='day'>
          <table class='showTable'>
            <thead>
              <tr>
                <td class='header' colspan='3'>
                #{(d = today).getFullYear()}-#{d.getMonth()+1}-#{d.getDate()}
                </td>
              </tr>
            </thead>
            <tbody>
            #{R shows, (s)->"
              <tr>
                <td class='time'>#{getTime s.datetime}</td>
                <td class='network'>#{s.network}</td>
                <td class='name'>#{s.title}</td>
              </tr>
            "}
            </tbody>
          </table>
        </div>
      "

