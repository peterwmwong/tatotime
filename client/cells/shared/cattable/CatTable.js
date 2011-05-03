var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define([], (function() {
  if (typeof $ === "function") {
    $('head').append("<link href='http://fonts.googleapis.com/css?family=Anton' rel='stylesheet' type='text/css'/>");
  }
  return function() {
    var DefaultCategory, DefaultMember;
    DefaultMember = C.extend({
      'render <div class="member">': function(R) {
        return R(this.options.columns, __bind(function(col) {
          return "<div class='col " + col + "'>" + this.model[col] + "</div>";
        }, this));
      }
    });
    DefaultCategory = C.extend({
      'render <span>': function() {
        return "" + this.options.category;
      }
    });
    return {
      initialize: function() {
        var k, v, _base, _base2, _ref, _ref2;
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
                if ((_ref = (_base = this.options).memberCell) != null) {
          _ref;
        } else {
          _base.memberCell = DefaultMember;
        };
        return (_ref2 = (_base2 = this.options).categoryCell) != null ? _ref2 : _base2.categoryCell = DefaultCategory;
      },
      render: function(R) {
        return "" + (R(this.options.title && ("  <div class='title'>" + this.options.title + "</div>"))) + "\n<div id='categories'>\n" + (R(this._categoryNames, __bind(function(cat) {
          var catMembers;
          catMembers = this.options.getMembers(cat, this.model);
          return R((catMembers != null ? catMembers.length : void 0) > 0 && ("      <div class='category'>        <div class='header " + cat + "'>          " + (R(this.options.categoryCell, {
            category: cat
          })) + "        </div>        <div class='members'>          " + (R(catMembers, __bind(function(member) {
            return R(this.options.memberCell, {
              model: member,
              columns: this.options.columns
            });
          }, this))) + "        </div>      </div>"));
        }, this))) + "\n</div>";
      }
    };
  };
})());