(function() {
  define(['require'], function(require) {
    var baseUrl, getTime, toDate;
    baseUrl = 'http://tatotime_showinfo_dev.s3.amazonaws.com/shows/bydate/';
    toDate = function(d) {
      return "" + (d.getFullYear()) + "-" + (d.getMonth() + 1) + "-" + (d.getDate());
    };
    getTime = function(ts) {
      var d, hours, isPM, minutes;
      d = new Date(ts);
      isPM = d.getHours() > 11;
      hours = isPM ? d.getHours() - 12 : d.getHours();
      minutes = d.getMinutes();
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      return "" + hours + ":" + minutes;
    };
    return {
      getShowsForDate: function(date, done) {
        return require(["" + baseUrl + (toDate(date)) + ".json"], function(day) {
          var s, tsmap, _i, _len, _name, _ref, _ref2;
          tsmap = {};
          _ref = day.shows;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            s = _ref[_i];
            ((_ref2 = tsmap[_name = getTime(s.datetime)]) != null ? _ref2 : tsmap[_name] = []).push(s);
          }
          return done(tsmap);
        });
      }
    };
  });
}).call(this);
