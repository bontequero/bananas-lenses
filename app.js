(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("app.js", function(exports, require, module) {
// let Config = require('./config/config')
// config = new Config()

// let wut = null

// wut = config.getDataFromURL(Config.webstandards)
//   .then(result => result)
//   .catch(err => err)


// module.exports = Config
"use strict";
});

;require.register("config/config.js", function(exports, require, module) {
'use strict';

var axios = require('axios');

module.exports = new Config();

function Config() {
  this._webstandards = 'http://feeds.soundcloud.com/users/soundcloud:users:202737209/sounds.rss';
  this._YqlAPI = 'https://query.yahooapis.com/v1/public/yql?q=';
}

Config.prototype.getLink = function () {
  return this._webstandards;
};

Config.prototype.getDataFromURL = function (url) {
  var _this = this;

  return new Promise(function (resolve, reject) {
    var yqlQuery = 'select enclosure from rss where url="' + url + '"';
    var proxy_url = '' + _this._YqlAPI + encodeURIComponent(yqlQuery) + '&format=json&diagnostics=false&callback=';

    axios.get(proxy_url).then(function (res) {
      resolve(res.data.query.results.item);
    }).catch(function (err) {
      reject(err);
    });
  });
};
});

;require.register("initialize.js", function(exports, require, module) {
'use strict';

var wut = require('./config/config');

document.addEventListener('DOMContentLoaded', function () {
  var currentPodcast = localStorage.getItem('current') || null;

  console.log('Initialized app');

  wut.getDataFromURL(wut.getLink()).then(function (res) {
    var html = '';
    var length = res.length;

    for (var i = 0; i < length; ++i) {
      var current = currentPodcast === res[i].enclosure.url ? '<span style="color:red">X</span>' : '';

      html += '\n        <p>\n          ' + current + '\n          <a href="' + res[i].enclosure.url + '">' + res[i].enclosure.url + '</a>\n        </p>';
    }

    html = '<div>' + html + '</div>';

    document.body.innerHTML = html;
  }).catch(function (err) {
    alert(err);
  });

  document.addEventListener('click', function (event) {
    if (event.target.nodeName === 'A') {
      event.preventDefault();
      localStorage.setItem('current', event.target.href);
    }
  });
});
});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map