var E, L, emptyBuf, fs, gzip, http, isRerun, normalizeTime, putjson, showComparator, xml2js;
fs = require('fs');
gzip = require('gzip');
L = console.log.bind(console);
E = console.error.bind(console);
if (typeof process.argv[2] !== 'string') {
  E("Must supply JSON file containing Amazon S3 info (key, secret, bucket)");
  process.exit();
}
putjson = (function() {
  var client;
  client = require('knox').createClient(JSON.parse(fs.readFileSync(process.argv[2], 'ascii')));
  return function(name, jsonObj) {
    return gzip("define(" + (JSON.stringify(jsonObj)) + ");", function(gzerr, gzjson) {
      var req;
      req = client.put("/shows/bydate/" + name + ".json", {
        'Content-Length': gzjson.length,
        'Content-Type': 'application/javascript',
        'Content-Encoding': 'gzip'
      });
      req.on('response', function(res) {
        return L("PUT [" + res.statusCode + "] " + req.url);
      });
      return req.end(gzjson);
    });
  };
})();
http = require('http');
xml2js = require('xml2js-expat');
emptyBuf = new Buffer("");
isRerun = (function() {
  var airDateRegex, db;
  db = {};
  airDateRegex = /Episode Info\@.*\^(.*)/;
  return function(s, sdate, done) {
    var airdate, cb, opts, _ref;
    sdate = new Date(sdate.getFullYear(), sdate.getMonth(), sdate.getDate());
    if ((airdate = (_ref = db[s.sid]) != null ? _ref[s.ep] : void 0) != null) {
      return done(void 0, airdate < sdate.valueOf());
    } else {
      opts = {
        host: 'services.tvrage.com',
        port: 80,
        path: "/tools/quickinfo.php?sid=" + s.sid + "&ep=" + s.ep
      };
      cb = function(res) {
        var qidata;
        qidata = "";
        res.on('data', function(data) {
          return qidata += data.toString();
        });
        return res.on('end', function() {
          var datems, edb, match;
          match = airDateRegex.exec(qidata);
          edb = db[s.sid] || (db[s.sid] = {});
          datems = new Date(match != null ? match[1] : void 0).valueOf();
          return done(void 0, isNaN(datems) && false || (edb[s.ep] = datems) < sdate.valueOf());
        });
      };
      return http.get(opts, cb).on('error', done);
    }
  };
})();
normalizeTime = (function() {
  var r;
  r = /^0?(\d+:\d+) (am|pm)$/;
  return function(timeString) {
    var _ref;
    return (_ref = r.exec(timeString)) != null ? _ref[1] : void 0;
  };
})();
showComparator = function(_arg, _arg2) {
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
};
L("--- Downloading full schedule ---");
http.get({
  host: 'services.tvrage.com',
  port: 80,
  path: '/feeds/fullschedule.php?country=US'
}, function(res) {
  var parser;
  parser = new xml2js.Parser();
  parser.addListener('end', function(result, err) {
    var day, _fn, _i, _len, _ref;
    L("--- Parsing full schedule ---");
    if (err) {
      return E('ERROR: ', err);
    }
    try {
      _ref = result.DAY;
      _fn = function() {
        var d, dayParsed, dayResults, s, t, time, timeResults, waiting, writeJson, _i, _j, _len, _len2, _ref, _ref2;
        writeJson = (function() {
          var date, name;
          date = new Date(day['@'].attr);
          name = "" + (date.getFullYear()) + "-" + (date.getMonth() + 1) + "-" + (date.getDate());
          return function(data) {
            return putjson(name, data);
          };
        })();
        dayResults = {};
        dayParsed = false;
        waiting = 0;
        _ref = [].concat(day.time);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          t = _ref[_i];
          if ((d = new Date("" + day['@'].attr + " " + (time = t['@'].attr) + " EST")).getHours() >= 20) {
            dayResults[normalizeTime(time)] = (timeResults = []);
            d.setHours(d.getHours() - 1);
            _ref2 = [].concat(t.show);
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              s = _ref2[_j];
              waiting++;
              isRerun(s, d, (function(d, s, timeResults) {
                return function(e, rerun) {
                  var k, shows;
                  waiting--;
                  if (e != null) {
                    E("!!! Error determining rerun for show: '" + s['@'].name + "', ep: '" + s.ep + "'");
                  } else {
                    timeResults.push({
                      sid: s.sid,
                      title: s['@'].name,
                      eptitle: s.title,
                      rerun: rerun,
                      ep: s.ep,
                      network: s.network
                    });
                  }
                  if (dayParsed && waiting === 0) {
                    for (k in dayResults) {
                      shows = dayResults[k];
                      shows.sort(showComparator);
                    }
                    return writeJson(dayResults);
                  }
                };
              })(d, s, timeResults));
            }
          }
        }
        return dayParsed = true;
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        day = _ref[_i];
        _fn();
      }
    } catch (ex) {
      E("!!! Error parsing full schedule: ", (typeof ex != "undefined" && ex !== null ? ex.stack : void 0) || ex);
    }
  });
  res.on('data', function(data) {
    return parser.parseBuffer(data, false);
  });
  return res.on('end', function() {
    return parser.parseBuffer(emptyBuf, true);
  });
});