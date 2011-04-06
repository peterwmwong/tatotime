cell.define ['data/ShowService'], (ShowService)->
  getTime = (ts)->
    d = new Date ts
    isPM = d.getHours() > 11
    hours = if isPM then d.getHours()-12 else d.getHours()
    minutes = d.getMinutes()
    if minutes < 10
      minutes = '0'+minutes
    "#{hours}:#{minutes} #{if isPM then "PM" else "AM"}"

  render: (R)->
    ShowService.getShows (shows)->
      R.async R [shows.yesterday,shows.today,shows.tomorrow], (day)->
        """
        <div class='day'>
          <table class='showTable'>
            <tbody>
            #{R day, (s)-> "
              <tr>
                <td class='time'>#{getTime s.time}</td>
                <td class='network'>#{s.network}</td>
                <td class='name'>#{s.name}</td>
              </tr>
            "}
            </tbody>
          </table>
        </div>
        """

