(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  (function() {
    var $, document, window;
    window = this;
    document = window.document || {
      createElement: function() {}
    };
    $ = window.$ || function() {};
    return define('C', [], function() {
      var C, bind, err, extendObj, identity, inherits, uniqueId, __preinstalledCells__, _ref;
      bind = (function() {
        var fbind, slice;
        slice = Array.prototype.slice;
        if (fbind = Function.prototype.bind) {
          return function(func, obj) {
            return fbind.apply(func, [obj].concat(slice.call(arguments, 2)));
          };
        } else {
          return function(func, obj) {
            var args;
            args = slice.call(arguments, 2);
            return function() {
              return func.apply(obj, args.concat(slice.call(arguments)));
            };
          };
        }
      })();
      err = typeof (typeof console != "undefined" && console !== null ? console.error : void 0) === 'function' ? function(msg) {
        return console.error(msg);
      } : function() {};
      identity = function(a) {
        return a;
      };
      extendObj = function(destObj, srcObj) {
        var p;
        for (p in srcObj) {
          destObj[p] = srcObj[p];
        }
        return destObj;
      };
      uniqueId = (function() {
        var postfix;
        postfix = 0;
        return function(prefix) {
          return prefix + (postfix++);
        };
      })();
      inherits = (function() {
        var ctor;
        ctor = function() {};
        return function(parent, protoProps) {
          var child;
          child = protoProps && protoProps.hasOwnProperty('constructor') ? protoProps.constructor : function() {
            return parent.apply(this, arguments);
          };
          extendObj(child, parent);
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          extendObj(child.prototype, protoProps);
          child.prototype.constructor = child;
          child.__super__ = parent.prototype;
          return child;
        };
      })();
      (_ref = window.C) != null ? _ref : window.C = C = (function() {
        var optsToProps, tmpNode;
        tmpNode = document.createElement('div');
        optsToProps = ['model', 'collection', 'class', 'id'];
        return function(options) {
          var className, n, prop, propName, renderHelper_nocheck, _i, _j, _len, _len2, _ref;
          this.options = options != null ? options : {};
          this._cid = uniqueId('__cell_instance_');
          for (_i = 0, _len = optsToProps.length; _i < _len; _i++) {
            propName = optsToProps[_i];
            if (prop = this.options[propName]) {
              this[propName] = prop;
            }
          }
          this._parent = this.options.parent;
          this._onrender = typeof this.options.onrender === 'function' ? options.onrender : void 0;
          tmpNode.innerHTML = this.__renderOuterHTML;
          this.el = tmpNode.children[0];
          className = "";
          _ref = [this.__cell_name, this.el.className, this["class"]];
          for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
            n = _ref[_j];
            if (n) {
              className += className ? ' ' + n : n;
            }
          }
          this.el.className = className;
          (typeof this.id === 'string') && (this.el.id = this.id);
          renderHelper_nocheck = __bind(function(a, b) {
            var cell, e, i, res, type, uid, _i, _len, _ref;
            if (!(a != null) || a === false) {
              return "";
            } else if ((type = typeof a) === 'string' || type === 'number') {
              return a;
            } else if (((_ref = a.prototype) != null ? _ref.C : void 0) === a) {
              cell = new a(extendObj(b != null ? b : {}, {
                parent: this
              }));
              return "<" + cell.__renderTagName + " id='" + cell._cid + "'></" + cell.__renderTagName + ">";
            } else if (a instanceof HTMLElement) {
              this._renderQ[uid = uniqueId('__cell_render_node_')] = a;
              return "<" + a.tagName + " id='" + uid + "'></" + a.tagName + ">";
            } else if (a instanceof Array) {
              i = 0;
              res = "";
              if (typeof b !== 'function') {
                b = identity;
              }
              for (_i = 0, _len = a.length; _i < _len; _i++) {
                e = a[_i];
                res += renderHelper_nocheck(b(e, i++, a));
              }
              return res;
            } else {
              err('render({CType,HTMLElement,string,number},[cellOptions])');
              return "";
            }
          }, this);
          this._renderHelper = __bind(function(a, cellOpts) {
            if (this._renderQ == null) {
              return "";
            } else {
              return renderHelper_nocheck(a, cellOpts);
            }
          }, this);
          this._renderHelper.async = bind(this.__renderinnerHTML, this);
          return this.update();
        };
      })();
      C.extend = (function() {
        var eventsNameRegex, extend, renderFuncNameRegex;
        renderFuncNameRegex = /render( <(\w+)([ ]+.*)*>)*/;
        eventsNameRegex = /bind( (.+))?/;
        return extend = function(protoProps, name) {
          var bindProp, child, css, cssref, desc, ebinds, el, handler, match, p, prop, propName, tag, _ref, _ref2, _ref3, _ref4;
          ebinds = [];
          for (propName in protoProps) {
            prop = protoProps[propName];
            if ((match = eventsNameRegex.exec(propName)) && typeof prop === 'object') {
              bindProp = (_ref = match[2]) != null ? _ref : 'el';
              for (desc in prop) {
                handler = prop[desc];
                if (typeof handler === 'string') {
                  prop[desc] = (_ref2 = protoProps[handler]) != null ? _ref2 : this.prototype[handler];
                }
              }
              ebinds.push({
                prop: bindProp,
                desc: prop
              });
            } else if (!protoProps.__renderTagName && (match = renderFuncNameRegex.exec(propName))) {
              if (typeof (protoProps.__render = prop) !== 'function') {
                err("C.extend expects '" + propName + "' to be a function");
                return;
              }
              tag = protoProps.__renderTagName = (_ref3 = match[2]) != null ? _ref3 : 'div';
              protoProps.__renderOuterHTML = "<" + tag + ((_ref4 = match[3]) != null ? _ref4 : "") + "></" + tag + ">";
            }
          }
          if (ebinds.length) {
            protoProps.__eventBindings = ebinds;
          }
          child = inherits(this, protoProps);
          if (!(p = child.prototype).__renderTagName) {
            return err('C.extend([constructor:Function],prototypeMembers:Object): could not find a render function in prototypeMembers');
          } else {
            child.extend = extend;
            p.C = child;
            if (name) {
              p.__cell_name = name;
            }
            if (typeof (css = protoProps.css) === 'string') {
              el = document.createElement('style');
              el.innerHTML = css;
            } else if (typeof (cssref = protoProps.css_href) === 'string') {
              el = document.createElement('link');
              el.href = cssref;
              el.rel = 'stylesheet';
            }
            if (el) {
              el.type = 'text/css';
              $('head').append(el);
            }
            return child;
          }
        };
      })();
      C.prototype = {
        $: function(selector) {
          return $(selector, this.el);
        },
        update: function() {
          var innerHTML;
          if (!this._renderQ) {
            this._renderQ = {};
            if (typeof this.initialize == "function") {
              this.initialize();
            }
            if (typeof (innerHTML = this.__render(this._renderHelper)) === 'string') {
              return this.__renderinnerHTML(innerHTML);
            }
          }
        },
        __delegateEvents: (function() {
          var bindablebinder, elEventRegex, elbinder, getBinders, selbinder;
          elEventRegex = /^(\w+)\s*(.*)$/;
          selbinder = function(sel, eventName, prop, handler, obj) {
            var observed;
            handler = bind(handler, obj);
            eventName = "" + eventName + "." + obj._cid;
            (observed = $(obj[prop])).delegate(sel, eventName, handler);
            return function() {
              return observed.undelegate(sel, eventName, handler);
            };
          };
          elbinder = function(eventName, prop, handler, obj) {
            var observed;
            handler = bind(handler, obj);
            (observed = $(obj[prop])).bind(eventName, handler);
            return function() {
              return observed.unbind(eventName, handler);
            };
          };
          bindablebinder = function(eventName, prop, handler, obj) {
            var observed;
            handler = bind(handler, obj);
            (observed = obj[prop]).bind(eventName, handler);
            return function() {
              return observed.unbind(eventName, handler);
            };
          };
          getBinders = function(obj, prop, bindDesc) {
            var binders, desc, eventName, handler, match, matched, observed, sel, selector, _ref, _ref2;
            observed = obj[prop];
            binders = [];
            for (desc in bindDesc) {
              handler = bindDesc[desc];
              if (typeof desc === 'string') {
                if (observed.nodeType === 1) {
                  _ref2 = (_ref = elEventRegex.exec(desc)) != null ? _ref : [], matched = _ref2[0], eventName = _ref2[1], selector = _ref2[2];
                  if (match = elEventRegex.exec(desc)) {
                    binders.push((sel = match[2]) ? bind(selbinder, null, sel, eventName, prop, handler) : bind(elbinder, null, eventName, prop, handler));
                  }
                } else if (typeof observed.bind === 'function') {
                  binders.push(bind(bindablebinder, null, desc, prop, handler));
                }
              }
            }
            return binders;
          };
          return function() {
            var b, binderCache, ebindings, ub, _i, _j, _k, _len, _len2, _len3, _ref, _ref2;
            if (this._unbinds) {
              _ref = this._unbinds;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                ub = _ref[_i];
                try {
                  ub();
                } catch (_e) {}
              }
              delete this._unbinds;
            }
            if (ebindings = this.C.prototype.__eventBindings) {
              delete this.C.prototype.__eventBindings;
              binderCache = [];
              for (_j = 0, _len2 = ebindings.length; _j < _len2; _j++) {
                b = ebindings[_j];
                binderCache = binderCache.concat(getBinders(this, b.prop, b.desc));
              }
              this.C.prototype.__binderCache = binderCache;
            }
            if (this.__binderCache) {
              this._unbinds = [];
              _ref2 = this.__binderCache;
              for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
                b = _ref2[_k];
                this._unbinds.push(b(this));
              }
            }
          };
        })(),
        __renderinnerHTML: function(innerHTML) {
          var child, pcid, _ref;
          if (this._renderQ) {
            this.el.innerHTML = this._ie_hack_innerHTML = innerHTML;
            _ref = this._renderQ;
            for (pcid in _ref) {
              child = _ref[pcid];
              if (!child.el.innerHTML) {
                child.el.innerHTML = child._ie_hack_innerHTML;
              }
              this.$("#" + pcid).replaceWith(child.el);
              delete child._ie_hack_innerHTML;
            }
            delete this._renderQ;
            return this.__onrender();
          }
        },
        __onchildrender: function(cell) {
          if (this._renderQ) {
            return this._renderQ[cell._cid] = cell;
          } else {
            delete cell._ie_hack_innerHTML;
            return this.$("#" + cell._cid).replaceWith(cell.el);
          }
        },
        __onrender: function() {
          var _ref;
          this.__delegateEvents();
          if ((_ref = this._parent) != null) {
            if (typeof _ref.__onchildrender == "function") {
              _ref.__onchildrender(this);
            }
          }
          try {
            return typeof this._onrender == "function" ? this._onrender(this) : void 0;
          } catch (_e) {}
        }
      };
      $(function() {
        var cellname, node, _i, _len, _ref;
        _ref = $('[data-cell]');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          if (cellname = node.getAttribute('data-cell')) {
            (function(node) {
              var baseurl, cachebust, cachebustAttr, opts;
              opts = {};
              cachebust = /(^\?cachebust)|(&cachebust)/.test(window.location.search);
              if (((cachebustAttr = node.getAttribute('data-cell-cachebust')) !== null || cachebust) && cachebustAttr !== 'false') {
                opts.urlArgs = "bust=" + (new Date().getTime());
              }
              if (baseurl = node.getAttribute('data-cell-baseurl')) {
                opts.baseUrl = baseurl;
              }
              return require(opts, ["C!" + cellname], function(CType) {
                return $(node).append(new CType().el);
              });
            })(node);
          }
        }
      });
      return {
        /*
        Exports
        */
        __preinstalledCells__: __preinstalledCells__ = [],
        pluginBuilder: 'C-pluginBuilder',
        load: (function() {
          var moduleNameRegex;
          moduleNameRegex = /(.*\/)?(.*)/;
          return function(name, req, load, config) {
            req([name], function(CDef) {
              var _ref;
              if (typeof CDef !== 'object') {
                err("Couldn't load " + name + " C. C definitions should be objects, but instead was " + (typeof CDef));
              } else {
                if (__preinstalledCells__.indexOf(name) === -1) {
                  (_ref = CDef.css_href) != null ? _ref : CDef.css_href = req.toUrl("" + name + ".css");
                }
                load(C.extend(CDef, moduleNameRegex.exec(name)[2]));
              }
            });
          };
        })()
      };
    });
  })();
}).call(this);
