var __slice = Array.prototype.slice;
define(['require'], function(require) {
  var baseUrl, toDate;
  baseUrl = 'http://tatotime.s3.amazonaws.com/shows/bydate/';
  toDate = function(d) {
    return "" + (d.getFullYear()) + "-" + (d.getMonth() + 1) + "-" + (d.getDate());
  };
  return {
    getShowsForDate: function(date, done) {
      return require(["" + baseUrl + (toDate(date)) + ".json"], done);
    },
    getWeekSchedule: function(done) {
      var show, time;
      time = function() {
        var shows, t;
        t = arguments[0], shows = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return {
          time: t,
          shows: shows
        };
      };
      show = function(name) {
        return {
          name: name
        };
      };
      return done({
        "2011-05-01T00:04:40.497Z": [time("2011-05-01T00:04:00.000Z", show('The Vampire Diaries')), time("2011-05-01T00:05:00.000Z", show('Big Bang Theory'), show('The Killing'))],
        "2011-05-02T00:04:40.497Z": [time("2011-05-02T00:05:00.000Z", show('Mad Men')), time("2011-05-02T00:06:00.000Z", show('Nova'), show('The Event'))],
        "2011-05-03T00:04:40.497Z": [time("2011-05-03T00:05:00.000Z", show('The Borgias'))],
        "2011-05-04T00:04:40.497Z": [time("2011-05-04T00:05:00.000Z", show('Game of Thrones'))]
      });
    }
  };
});