cell.define ['data/ShowService'], (ShowService)->

  now = Date.now()
  msInDay = 1000*60*60*24
  fromDate = toDateTime(now - msInDay)
  toDate = toDateTime(now + msInDay)

  getTime = (ts)->
    d = new Date ts
    isPM = d.getHours() > 11
    hours = if isPM then d.getHours()-12 else d.getHours()
    minutes = d.getMinutes()
    if minutes < 10
      minutes = '0'+minutes
    "#{hours}:#{minutes} #{if isPM then "PM" else "AM"}"

  render: (R)->
    ShowService.getShows fromDate,toDate,(days)->
      R.async R days, (d)->
        """
        <div class='day'>
          <table class='showTable'>
            <tbody>
            #{R d.shows, (s)-> "
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

