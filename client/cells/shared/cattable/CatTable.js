(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  cell.define(function() {
    $('head').append("<link href='http://fonts.googleapis.com/css?family=Anton' rel='stylesheet' type='text/css'>");
    return {
      initialize: function() {
        var k, v, _base, _base2, _base3, _ref, _ref2, _ref3;
        (_ref = (_base = this.options).columns) != null ? _ref : _base.columns = ['network', 'title'];
        (_ref2 = (_base2 = this.options).categories) != null ? _ref2 : _base2.categories = {
          '7:00': '7:00',
          '7:30': '7:30',
          '8:00': '8:00'
        };
        (_ref3 = (_base3 = this.options).getMembers) != null ? _ref3 : _base3.getMembers = (function() {
          var make;
          make = function(net, title) {
            return {
              network: net,
              title: title
            };
          };
          return function(cat, m) {
            return [make('ABC', 'Dancing With the Stars (US)'), make('FOX', 'House'), make('CBS', 'How I Met Your Mother')];
          };
        })();
        return this._categoryNames = (function() {
          var _ref, _results;
          _ref = this.options.categories;
          _results = [];
          for (k in _ref) {
            v = _ref[k];
            _results.push(k);
          }
          return _results;
        }).call(this);
      },
      render: function(R) {
        var numRenderedGroups, oddEven;
        numRenderedGroups = 0;
        oddEven = (function() {
          var isEven, r;
          isEven = false;
          r = function() {
            return (isEven = !isEven) && 'even' || 'odd';
          };
          r.reset = function() {
            return isEven = false;
          };
          return r;
        })();
        return "" + (R(this.options.title && ("  <div class='title'>" + this.options.title + "</div>"))) + "\n<table>\n  <tbody>\n    " + (R(this._categoryNames, __bind(function(cat) {
          var catMembers, _ref;
          catMembers = this.options.getMembers(cat, this.model);
          return R((catMembers != null ? catMembers.length : void 0) > 0 && ("          " + (R(numRenderedGroups++ > 0 && ("            <tr class='categorySpacer'>              <td colspan='" + ((((_ref = this.options.columns) != null ? _ref.length : void 0) || 0) + 2) + "'></td>            </tr>          "))) + "          <tr class='category " + (oddEven()) + "'>            <td rowspan='" + (catMembers.length || 0) + "' id='header' class='" + cat + "'>              <span>" + this.options.categories[cat] + "</span>            </td>            " + (R(catMembers, __bind(function(member, i) {
            return "              " + (R(i !== 0 && ("                <tr class='" + (oddEven()) + "'>              "))) + "                <td class='colSpacer'> </td>                " + (R(this.options.columns, __bind(function(col) {
              return "                  <td class='col " + col + "'>" + member[col] + "</td>                ";
            }, this))) + "          </tr>            ";
          }, this))) + "    "));
        }, this)));
      }
    };
  });
}).call(this);
