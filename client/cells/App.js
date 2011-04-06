(function() {
  cell.define(['data/ShowService'], function(ShowService) {
    var getTime;
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
        return ShowService.getShows(function(shows) {
          return R.async(R([shows.yesterday, shows.today, shows.tomorrow], function(day) {
            return "<div class='day'>\n  <table class='showTable'>\n    <tbody>\n    " + (R(day, function(s) {
              return "      <tr>        <td class='time'>" + (getTime(s.time)) + "</td>        <td class='network'>" + s.network + "</td>        <td class='name'>" + s.name + "</td>      </tr>    ";
            })) + "\n    </tbody>\n  </table>\n</div>";
          }));
        });
      }
    };
  });
}).call(this);
