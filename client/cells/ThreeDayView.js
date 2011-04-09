(function() {
  cell.define(['data/ShowService'], function(ShowService) {
    var fromDate, getTime, msInDay, now, toDate;
    now = Date.now();
    msInDay = 1000 * 60 * 60 * 24;
    fromDate = toDateTime(now - msInDay);
    toDate = toDateTime(now + msInDay);
    getTime = function(ts) {
      var d, hours, isPM, minutes;
      d = new Date(ts);
      isPM = d.getHours() > 11;
      hours = isPM ? d.getHours() - 12 : d.getHours();
      minutes = d.getMinutes();
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      return "" + hours + ":" + minutes + " " + (isPM ? "PM" : "AM");
    };
    return {
      render: function(R) {
        return ShowService.getShows(fromDate, toDate, function(days) {
          return R.async(R(days, function(d) {
            return "<div class='day'>\n  <table class='showTable'>\n    <tbody>\n    " + (R(d.shows, function(s) {
              return "      <tr>        <td class='time'>" + (getTime(s.time)) + "</td>        <td class='network'>" + s.network + "</td>        <td class='name'>" + s.name + "</td>      </tr>    ";
            })) + "\n    </tbody>\n  </table>\n</div>";
          }));
        });
      }
    };
  });
}).call(this);
