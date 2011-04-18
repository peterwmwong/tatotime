(function() {
  cell.define(['data/ShowService'], function(ShowService) {
    var getTime, msInDay, today, tomorrow, yesterday;
    msInDay = 1000 * 60 * 60 * 24;
    today = new Date();
    yesterday = new Date(today.valueOf() - msInDay);
    tomorrow = new Date(today.valueOf() + msInDay);
    getTime = function(ts) {
      var d, hours, isPM, minutes;
      d = new Date(ts);
      isPM = d.getHours() > 11;
      hours = isPM ? d.getHours() - 12 : d.getHours();
      minutes = d.getMinutes();
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      return "" + hours + ":" + minutes + " <span class='ampm'>" + (isPM ? "PM" : "AM") + "</span>";
    };
    return {
      render: function(R) {
        return ShowService.getShowsForDate(today, function(shows) {
          var d;
          return R.async("        <div class='day'>          <table class='showTable'>            <thead>              <tr>                <td class='header' colspan='3'>                " + ((d = yesterday).getFullYear()) + "-" + (d.getMonth() + 1) + "-" + (d.getDate()) + "                </td>              </tr>            </thead>            <tbody>            " + (R(shows, function(s) {
            return "              <tr>                <td class='time'>" + (getTime(s.datetime)) + "</td>                <td class='network'>" + s.network + "</td>                <td class='name'>" + s.title + "</td>              </tr>            ";
          })) + "            </tbody>          </table>        </div>      ");
        });
      }
    };
  });
}).call(this);
