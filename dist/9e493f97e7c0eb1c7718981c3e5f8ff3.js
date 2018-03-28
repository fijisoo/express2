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
})({8:[function(require,module,exports) {
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
var tbody = document.querySelector('.table tbody');
var paginEl = document.querySelector('.pagin');
var form = document.getElementById('formularz');
var slider = document.querySelector('.slidecontainer');
var currentPage = 0;
var elementsPerPage = 5;
function removeChildElements(parentEl) {
    while (parentEl.firstChild) {
        parentEl.removeChild(parentEl.firstChild);
    }
}
function getUsersCounter() {
    return fetch('/usersCounter').then(function (response) {
        return response.json().then(function (data) {
            return data;
        });
    })["catch"](function (err) {
        return console.log;
    });
}
function getUsersPerPage(pageNumber, numberOfElements) {
    numberOfElements = Math.max(1, numberOfElements);
    var firstSemafor = numberOfElements * pageNumber;
    var secondSemafor = numberOfElements + numberOfElements * pageNumber;
    return fetch("/getUsers?firstSemafor=" + firstSemafor + "&secondSemafor=" + secondSemafor).then(function (response) {
        return response.json().then(function (data) {
            return { response: response, data: data };
        });
    })["catch"](function (err) {
        return console.log;
    });
}
var generateUsersTable = function generateUsersTable(arr, tBodyElement) {
    removeChildElements(tBodyElement);
    var lastIndex = elementsPerPage;
    arr.forEach(function (obj, index) {
        var trElement = document.createElement('tr');
        var thElement = document.createElement('th');
        thElement.innerHTML = (parseInt(index) + 1 + currentPage * lastIndex).toString();
        trElement.appendChild(thElement);
        tBodyElement.appendChild(trElement);
        for (var i in obj) {
            var thElement_1 = document.createElement('th');
            thElement_1.innerHTML = obj[i];
            trElement.appendChild(thElement_1);
            tbody.appendChild(trElement);
        }
    });
};
var generateSlider = function generateSlider() {
    var input = document.createElement('input');
    var sliderVal = document.getElementById('slidecontainerval');
    removeChildElements(slider);
    input.type = 'range';
    input.min = '1';
    getUsersCounter().then(function (res) {
        input.max = res;
    });
    input.value = '1';
    input.className = 'slider';
    input.id = 'myRange';
    input.addEventListener('change', function (ev) {
        elementsPerPage = parseInt(this.value);
        sliderVal.value = this.value;
        showUsers();
    });
    slider.appendChild(input);
};
window.onload = generateSlider;
var generateNextBackButtons = function generateNextBackButtons(parent, value, text, buttonCounter) {
    var input = document.createElement('input');
    input.type = 'button';
    input.innerText = text;
    input.value = text;
    if (value >= 0 && value < buttonCounter) {
        console.log('value: ', value, 'elementsPerPage: ', elementsPerPage);
        input.addEventListener('click', function (ev) {
            currentPage = value;
            showUsers();
        });
    } else {
        input.removeEventListener('click', function (ev) {
            currentPage = value;
            showUsers();
        });
    }
    parent.appendChild(input);
};
var generatePagination = function generatePagination(counter, numberOfElements, element) {
    var buttonCounter = parseInt(counter) / parseInt(numberOfElements);
    removeChildElements(element);
    if (buttonCounter > 2) {
        generateNextBackButtons(element, currentPage - 1, '<<', buttonCounter);
    }
    for (var i = 0; i < buttonCounter; i++) {
        var input = document.createElement('input');
        input.type = 'button';
        input.innerText = "" + i;
        input.value = "" + i;
        input.addEventListener('click', function (ev) {
            currentPage = parseInt(this.value);
            showUsers();
        });
        element.appendChild(input);
    }
    if (buttonCounter > 2) {
        generateNextBackButtons(element, currentPage + 1, '>>', buttonCounter);
    }
};
var showUsers = function showUsers() {
    return Promise.all([getUsersCounter(), getUsersPerPage(currentPage, elementsPerPage)]).then(function (res) {
        var counter = res[0];
        var usersArr = res[1].data;
        console.log('users Arr :', usersArr);
        generateUsersTable(usersArr, tbody);
        generatePagination(counter, elementsPerPage, paginEl);
    });
};
showUsers()["catch"](function (err) {
    return console.log;
});
form.addEventListener('submit', function (ev) {
    addNewUser().then(function (response) {
        console.log(response);
        response.json().then(function (data) {
            console.log('tutaj: ', data);
        });
    });
    event.preventDefault();
});
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
    }).then(function () {
        showUsers();
        generateSlider();
    });
}
},{"./model":8}],9:[function(require,module,exports) {

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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '63748' + '/');
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
},{}]},{},[9,3])
//# sourceMappingURL=/9e493f97e7c0eb1c7718981c3e5f8ff3.map