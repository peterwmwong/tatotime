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
          getMembers: function(cat, model) {
            return tsmap[cat];
          }
        }));
      });
    }
  };
});