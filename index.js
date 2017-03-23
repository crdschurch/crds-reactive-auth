module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var ReactiveAuth = (function () {

  /**
   * Handles watching for changes with the auth cookie and dispatches the
   *     appropriate events.
   *
   * @constructor
   * @param {string} name - the name of the auth cookie that should be watched.
   * @param {Function} defaultHandler - A default callback for the event
   *     listeners. @default console.log
   */

  function ReactiveAuth(name, defaultHandler) {
    _classCallCheck(this, ReactiveAuth);

    // If name is falsy then set the cookieName to an empty string
    // FIXME: should defualt values be hard coded here...?
    var cookieName = name && typeof name === "string" ? name : "sessionId";

    // This regex extracts the value of the cookie `cookieName`
    this.cookieValRe = new RegExp("(?:(?:^|.*;\\s*)" + cookieName + "\\s*=\\s*([^;]*).*$)|^.*$", "");
    this.cookieVal = undefined;
    this.watchAuthCookie = undefined;

    /* eslint-disable no-console */
    // Sets up the default event handler for the update and expire events
    this.updateHandler = defaultHandler && typeof defaultHandler === "function" ? defaultHandler : console.log;
    this.expireHandler = defaultHandler && typeof defaultHandler === "function" ? defaultHandler : console.log;
    /* eslint-enable no-console */
  }

  _createClass(ReactiveAuth, {
    subscribe: {

      /**
       * Subscribes the client to events that are dispatched by this class.
       *
       * @param {number} freq - the frequency in which changes should be looked for.
       *     @default 3000 (milliseconds)
       * @param {Function} updateCallback - a specific function that should be called
       *     when the `updateAuth` event is dispatched.
       * @param {Function} expireCallback - a specific function that should be called
       *     when the `expireAuth` event is dispatched.
       * @returns {number} The ID of the interval that was set.
       */

      value: function subscribe(freq, updateCallback, expireCallback) {
        var _this = this;

        this.createEventListeners(updateCallback, expireCallback);

        if (this.watchAuthCookie) {
          clearInterval(this.watchAuthCookie);
        }

        var frequency = freq > 0 ? freq : 3000;

        this.watchAuthCookie = setInterval(function () {
          var browserCookieVal = document.cookie.replace(_this.cookieValRe, "$1");

          if (!browserCookieVal && _this.cookieVal) {
            // The cookie expired
            window.dispatchEvent(new CustomEvent("expireAuth", {
              detail: {
                message: "Auth Cookie Expired",
                oldValue: _this.cookieVal,
                currentValue: browserCookieVal },
              bubbles: true,
              cancelable: true
            }));

            _this.cookieVal = browserCookieVal;
          } else if (_this.cookieVal !== browserCookieVal) {
            // The cookie was updated manually by the user
            window.dispatchEvent(new CustomEvent("updateAuth", {
              detail: {
                message: "Updating Auth Cookie",
                oldValue: _this.cookieVal,
                currentValue: browserCookieVal },
              bubbles: true,
              cancelable: true
            }));

            _this.cookieVal = browserCookieVal;
          }
        }, frequency);

        return this.watchAuthCookie;
      }
    },
    unsubscribe: {

      /**
       * Unsubscribes the client from the events that this class dispatches
       *     and stops the interval that was running.
       */

      value: function unsubscribe() {
        clearInterval(this.watchAuthCookie);
        this.watchAuthCookie = undefined;

        window.removeEventListener("updateAuth");
        window.removeEventListener("expireAuth");
      }
    },
    createEventListeners: {

      /**
       * Creates the event listeners for the `updateAuth` and `expireAuth` events
       *     and attaches them to the DOM.
       * @private
       * @param {Function} updateCb - a specific function that should be called
       *     when the `updateAuth` event is dispatched.
       * @param {Function} expireCb - a specific function that should be called
       *     when the `expireAuth` event is dispatched.
       */

      value: function createEventListeners(updateCb, expireCb) {
        if (updateCb && typeof updateCb === "function") {
          this.updateHandler = updateCb;
        }
        if (expireCb && typeof expireCb === "function") {
          this.expireHandler = expireCb;
        }

        window.addEventListener("updateAuth", this.updateHandler, false);
        window.addEventListener("expireAuth", this.expireHandler, false);
      }
    }
  });

  return ReactiveAuth;
})();

module.exports = ReactiveAuth;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ReactiveAuth = _interopRequire(__webpack_require__(0));

exports["default"] = ReactiveAuth;

/***/ })
/******/ ]);