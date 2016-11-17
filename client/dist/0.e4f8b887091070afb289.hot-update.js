webpackHotUpdate(0,{

/***/ 250:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(78);

	var _react2 = _interopRequireDefault(_react);

	var _reactGoogleLoginComponent = __webpack_require__(252);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Login = function (_React$Component) {
	    _inherits(Login, _React$Component);

	    //oRnhywks5PZ4_9NHqlVd-h9F
	    function Login(props, context) {
	        _classCallCheck(this, Login);

	        return _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this, props, context));
	    }

	    _createClass(Login, [{
	        key: 'responseGoogle',
	        value: function responseGoogle(googleUser) {
	            var id_token = googleUser.getAuthResponse().id_token;
	            console.log({ accessToken: id_token });
	            console.log(googleUser.getBasicProfile());
	            //anything else you want to do(save to localStorage)...
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return _react2.default.createElement(
	                'div',
	                null,
	                _react2.default.createElement(_reactGoogleLoginComponent.GoogleLogin, { socialId: '119719318456-ohdb4e11na4ohkggtgs91rtmibk2d4c9.apps.googleusercontent.com', 'class': 'google-login', scope: 'profile', responseHandler: this.responseGoogle, buttonText: 'Login With Google' })
	            );
	        }
	    }]);

	    return Login;
	}(_react2.default.Component);

	exports.default = Login;

/***/ },

/***/ 252:
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory(__webpack_require__(78));
		else if(typeof define === 'function' && define.amd)
			define(["react"], factory);
		else if(typeof exports === 'object')
			exports["react-google-login-component"] = factory(require("react"));
		else
			root["react-google-login-component"] = factory(root["React"]);
	})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};

	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {

	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;

	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};

	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;

	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}


	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;

	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;

	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";

	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.GoogleLogin = undefined;

		var _GoogleLogin = __webpack_require__(1);

		var _GoogleLogin2 = _interopRequireDefault(_GoogleLogin);

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

		exports.GoogleLogin = _GoogleLogin2.default;

	/***/ },
	/* 1 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});

		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

		var _react = __webpack_require__(2);

		var _react2 = _interopRequireDefault(_react);

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

		var GoogleLogin = function (_React$Component) {
		  _inherits(GoogleLogin, _React$Component);

		  function GoogleLogin(props) {
		    _classCallCheck(this, GoogleLogin);

		    return _possibleConstructorReturn(this, Object.getPrototypeOf(GoogleLogin).call(this, props));
		  }

		  _createClass(GoogleLogin, [{
		    key: 'componentDidMount',
		    value: function componentDidMount() {
		      (function (d, s, id) {
		        var js,
		            gs = d.getElementsByTagName(s)[0];
		        if (d.getElementById(id)) {
		          return;
		        }
		        js = d.createElement(s);js.id = id;
		        js.src = 'https://apis.google.com/js/platform.js';
		        gs.parentNode.insertBefore(js, gs);
		      })(document, 'script', 'google-platform');
		    }
		  }, {
		    key: 'checkLoginState',
		    value: function checkLoginState(response) {
		      if (auth2.isSignedIn.get()) {
		        var profile = auth2.currentUser.get().getBasicProfile();
		      } else {
		        if (this.props.responseHandler) {
		          this.props.responseHandler({ status: response.status });
		        }
		      }
		    }
		  }, {
		    key: 'clickHandler',
		    value: function clickHandler() {
		      var socialId = this.props.socialId,
		          responseHandler = this.props.responseHandler,
		          scope = this.props.scope;

		      gapi.load('auth2', function () {
		        var auth2 = gapi.auth2.init({
		          client_id: socialId,
		          fetch_basic_profile: false,
		          scope: scope
		        });
		        auth2.signIn().then(function (googleUser) {
		          responseHandler(googleUser);
		        });
		      });
		    }
		  }, {
		    key: 'render',
		    value: function render() {
		      return _react2.default.createElement(
		        'div',
		        null,
		        _react2.default.createElement(
		          'button',
		          { className: this.props.class, onClick: this.clickHandler.bind(this) },
		          this.props.buttonText
		        )
		      );
		    }
		  }]);

		  return GoogleLogin;
		}(_react2.default.Component);

		exports.default = GoogleLogin;

	/***/ },
	/* 2 */
	/***/ function(module, exports) {

		module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

	/***/ }
	/******/ ])
	});
	;

/***/ }

})