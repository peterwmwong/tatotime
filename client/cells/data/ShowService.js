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
          var s, shows, ts, tsmap, _i, _len, _name, _ref, _ref2;
          tsmap = {};
          _ref = day.shows;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            s = _ref[_i];
            ((_ref2 = tsmap[_name = getTime(s.datetime)]) != null ? _ref2 : tsmap[_name] = []).push(s);
          }
          for (ts in tsmap) {
            shows = tsmap[ts];
            shows.sort(function(_arg, _arg2) {
              var a, b;
              a = _arg.title;
              b = _arg2.title;
              if (a < b) {
                return -1;
              } else if (a > b) {
                return 1;
              } else {
                return 0;
              }
            });
          }
          return done(tsmap);
        });
      }
    };
  });
}).call(this);
