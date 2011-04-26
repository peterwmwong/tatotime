var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define([], function() {
  var defaultRenderCol;
  if (typeof $ == "function") {
    $('head').append("<link href='http://fonts.googleapis.com/css?family=Anton' rel='stylesheet' type='text/css'>");
  }
  defaultRenderCol = function(colName, col, member) {
    return col;
  };
  return {
    initialize: function() {
      var k, rc, v;
      this._categoryNames = (function() {
        var _ref, _results;
        _ref = this.options.categories;
        _results = [];
        for (k in _ref) {
          v = _ref[k];
          _results.push(k);
        }
        return _results;
      }).call(this);
      return this._colRenders = typeof (rc = this.options.renderColumn === 'function') && rc || defaultRenderCol;
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
      return "" + (R(this.options.title && ("  <div class='title'>" + this.options.title + "</div>"))) + "\n<div id='categories'>\n" + (R(this._categoryNames, __bind(function(cat) {
        var catMembers;
        catMembers = this.options.getMembers(cat, this.model);
        return R((catMembers != null ? catMembers.length : void 0) > 0 && ("      <div class='category'>        <div class='header " + cat + "'>          <span>" + this.options.categories[cat] + "</span>        </div>        <div class='members'>        " + (R(catMembers, __bind(function(member) {
          return "            <div class='member'>            " + (R(this.options.columns, __bind(function(col) {
            return "              <div class='col " + col + "'>" + member[col] + "</div>            ";
          }, this))) + "            </div>        ";
        }, this))) + "        </div>      </div>"));
      }, this))) + "\n</div>";
    }
  };
});