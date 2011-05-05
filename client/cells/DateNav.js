var DAYS;
DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
define(['C!shared/cattable/CatTable', 'data/ShowService'], function(CatTable, ShowService) {
  return {
    render: function(R) {
      return ShowService.getWeekSchedule(function(dayShowsMap) {
        var day, days;
        days = {};
        for (day in dayShowsMap) {
          days[day] = day;
        }
        return R.async(R(CatTable, (function() {
          return {
            "class": 'navtable',
            categories: days,
            columns: ['date', 'shows'],
            getMembers: function(day) {
              return dayShowsMap[day];
            },
            categoryCell: C.extend({
              'render <div class="dateDay">': function(R) {
                var d, isEven;
                d = new Date(this.options.category);
                isEven = false;
                return "<div class='date'>" + (d.getDate()) + "</div>\n<div class='day'>" + DAYS[d.getDay()] + "</div>";
              }
            }),
            memberCell: C.extend({
              'render <div class="member">': function(R) {
                var d, hours, min;
                d = new Date(this.model.time);
                return "<div class='timeslot'>\n  <div class='time'>" + ((hours = d.getHours()) > 12 && (hours - 12) || hours) + ":" + ((min = d.getMinutes()) < 10 && ("0" + min) || min) + "</div>\n  <div class='shows'>\n    " + (R(this.model.shows, function(show) {
                  return "      <div class='show'>" + show.name + "</div>    ";
                })) + "\n  </div>\n</div>";
              }
            })
          };
        })()));
      });
    },
    bind: {
      'click .category': function(e) {
        this.$('.category.selected').removeClass('selected');
        $(e.target).parents('.category').andSelf().first().addClass('selected');
        return false;
      }
    }
  };
});