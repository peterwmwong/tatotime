(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  cell.define(function() {
    return {
      initialize: function() {
        var k, v, _ref;
        (_ref = this.config) != null ? _ref : this.config = {
          columns: ['network', 'title'],
          categories: {
            '7:00': '7:00',
            '7:30': '7:30',
            '8:00': '8:00'
          },
          getMembers: (function() {
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
          })()
        };
        return this._categoryNames = (function() {
          var _ref, _results;
          _ref = this.config.categories;
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
          var isEven;
          isEven = false;
          return function() {
            return (isEven = !isEven) && 'even' || 'odd';
          };
        })();
        return "<table>\n  <tbody>\n    " + (R(this._categoryNames, __bind(function(cat) {
          var catMembers, _ref;
          catMembers = this.config.getMembers(cat, this.model);
          return R((catMembers != null ? catMembers.length : void 0) > 0 && ("          " + (R(numRenderedGroups++ > 0 && ("            <tr class='categorySpacer'>              <td colspan='" + ((((_ref = this.config.columns) != null ? _ref.length : void 0) || 0) + 1) + "'> </td>            </tr>          "))) + "          <tr class='category " + (oddEven()) + "'>            <td rowspan='" + (catMembers.length || 0) + "' id='header' class='" + cat + "'>              " + this.config.categories[cat] + "            </td>            " + (R(catMembers, __bind(function(member, i) {
            return "              " + (R(i !== 0 && ("                <tr class='" + (oddEven()) + "'>              "))) + "                <td class='colSpacer'> </td>                " + (R(this.config.columns, __bind(function(col) {
              return "                  <td class='col " + col + "'>" + member[col] + "</td>                ";
            }, this))) + "          </tr>            ";
          }, this))) + "    "));
        }, this)));
      }
    };
  });
}).call(this);
