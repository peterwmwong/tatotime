var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['data/ShowService', 'C!shared/cattable/CatTable'], function(ShowService, CatTable) {
  var msInDay, today, tomorrow, yesterday;
  msInDay = 1000 * 60 * 60 * 24;
  today = new Date();
  yesterday = new Date(today.valueOf() - msInDay);
  tomorrow = new Date(today.valueOf() + msInDay);
  return {
    render: function(R) {
      return ShowService.getShowsForDate(today, function(tsmap) {
        var timeslots, ts, v;
        timeslots = {};
        for (ts in tsmap) {
          v = tsmap[ts];
          timeslots[ts] = ts;
        }
        return R.async(R(CatTable, {
          "class": 'day',
          title: 'Today',
          categories: timeslots,
          columns: ['network', 'title'],
          getMembers: function(cat) {
            return tsmap[cat].sort(function(a, b) {
              if (a.rerun === b.rerun) {
                return 0;
              } else if (b.rerun) {
                return 1;
              } else {
                return -1;
              }
            });
          },
          memberCell: C.extend({
            'render <div class="member">': function(R) {
              return R(this.options.columns, __bind(function(col) {
                return "<div class='col " + col + " " + (R(this.model.rerun && 'rerun')) + "'>" + this.model[col] + "</div>";
              }, this));
            }
          })
        }));
      });
    }
  };
});