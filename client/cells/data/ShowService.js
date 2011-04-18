(function() {
  define(['require'], function(require) {
    var baseUrl, toDate;
    baseUrl = 'http://tatotime_showinfo_dev.s3.amazonaws.com/shows/bydate/';
    toDate = function(d) {
      return "" + (d.getFullYear()) + "-" + (d.getMonth() + 1) + "-" + (d.getDate());
    };
    return {
      getShowsForDate: function(date, done) {
        return require(["" + baseUrl + (toDate(date)) + ".json"], function(day) {
          return done(day.shows);
        });
      }
    };
  });
}).call(this);
