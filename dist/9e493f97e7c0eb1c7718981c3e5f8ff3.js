// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({12:[function(require,module,exports) {
"use strict";

exports.__esModule = true;
var User = /** @class */function () {
    function User() {}
    User.prototype.addUser = function (name, surname, age, login, pass) {
        return {
            name: name,
            surname: surname,
            age: age,
            login: login,
            pass: pass
        };
    };
    return User;
}();
exports.User = User;
},{}],3:[function(require,module,exports) {
"use strict";

exports.__esModule = true;
var model_1 = require("./model");
var user = new model_1.User();
var pageNumber = 0;
function getUsersCounter() {
    return fetch('/getUsers').then(function (response) {
        return response.json().then(function (data) {
            return { response: response, data: data };
        });
    }).then(function (res) {
        console.log('response code: ', res.response, 'data: ', res.data);
    })["catch"](function (err) {
        return console.log;
    });
}
function getUsersPerPage(pageNumber, numberOfElements) {
    numberOfElements = Math.max(1, numberOfElements);
    var firstSemafor = 1 + numberOfElements * pageNumber;
    var secondSemafor = numberOfElements + numberOfElements * pageNumber;
    return fetch("/getUsers?firstSemafor=" + firstSemafor + "&secondSemafor=" + secondSemafor).then(function (response) {
        return response.json().then(function (data) {
            return { response: response, data: data };
        });
    })["catch"](function (err) {
        return console.log;
    });
}
function addNewUser() {
    var inputElements = document.querySelectorAll('#formularz input');
    return new Promise(function (resolve, reject) {
        var newUser = user.addUser(inputElements[0].value, inputElements[1].value, parseInt(inputElements[2].value), inputElements[3].value, inputElements[4].value);
        resolve(newUser);
    }).then(function (data) {
        return fetch("/addUser", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    });
}
var showUsers = function showUsers() {
    return Promise.all([getUsersCounter().then(function (res) {
        return res.json();
    }, getUsersPerPage(1, 1).then(function (res) {
        return res.json();
    }))]);
};
// let showUsers = function (){
//         let tbody = document.querySelector('.table tbody');
//         while (tbody.firstChild) {
//             tbody.removeChild(tbody.firstChild);
//         }
//         fetch('/getUsers').then((data)=>{
//             data.json().then(function (data){
//                 console.log(JSON.stringify(data));
//                 let paginDiv = document.querySelector('.pagin');
//                 let newP = document.createElement('p');
//                 newP.innerText = '' + data;
//                 paginDiv.appendChild(newP);
//             })
//         })
//
//         fetch(`/getUsers/` + pageNumber).then(function (data){
//             data.json().then(function (data){
//                 data.forEach((obj, index)=>{
//                     const trElement = document.createElement('tr');
//                     const thElement = document.createElement('th');
//                     thElement.innerHTML = index;
//                     trElement.appendChild(thElement);
//                     tbody.appendChild(trElement);
//                     for(let i in obj){
//                         const thElement = document.createElement('th');
//                         thElement.innerHTML = obj[i];
//                         trElement.appendChild(thElement);
//                         tbody.appendChild(trElement);
//                     }
//                 })
//             });
//         })
// };
//
// window.addEventListener("load", showUsers);
var form = document.getElementById('formularz');
// function example(currentPage = 0, elementsPerPage = 10) {
//     elementsPerPage = Math.max(1, elementsPerPage);
//     Promise.all([
//         fetch('/usersCount').then((res => res.json())),
//         fetch('/users?page=' + currentPage + '&elementsPerPage=' + elementsPerPage).then((res => res.json())),
//     ]).then((results) => {
//         const count = results[0];
//         const users = results[1];
//     });
// }
form.addEventListener('submit', function (ev) {
    addNewUser().then(function (response) {
        console.log(response);
        response.json().then(function (data) {
            console.log('tutaj: ', data);
        });
    });
    event.preventDefault();
});
},{"./model":12}],11:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '61159' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[11,3])
//# sourceMappingURL=/9e493f97e7c0eb1c7718981c3e5f8ff3.map