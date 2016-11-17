webpackHotUpdate(0,{

/***/ 251:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(78);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var GoogleLogin = function (_React$Component) {
	    _inherits(GoogleLogin, _React$Component);

	    function GoogleLogin(props) {
	        _classCallCheck(this, GoogleLogin);

	        var _this = _possibleConstructorReturn(this, (GoogleLogin.__proto__ || Object.getPrototypeOf(GoogleLogin)).call(this, props));

	        _this.state = {
	            connected: false
	        };
	        return _this;
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
	                js = d.createElement(s);
	                js.id = id;
	                js.src = 'https://apis.google.com/js/platform.js';
	                gs.parentNode.insertBefore(js, gs);
	            })(document, 'script', 'google-platform');
	        }
	    }, {
	        key: 'checkLoginState',
	        value: function checkLoginState(response) {
	            if (response.isSignedIn.get()) {
	                return response.currentUser.get().getBasicProfile();
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
	                checkLoginState = this.props.checkLoginState,
	                scope = this.props.scope;

	            gapi.load('auth2', function () {
	                var auth2 = gapi.auth2.getAuthInstance();
	                if (auth2 === null) {
	                    var initOptions = {
	                        client_id: socialId,
	                        fetch_basic_profile: true,
	                        scope: scope,
	                        cookie_policy: 'single_host_origin'
	                    };
	                    auth2 = gapi.auth2.init(initOptions);
	                    auth2.signIn().then(function (googleUser) {
	                        responseHandler(googleUser);
	                        var state = this.checkLoginState(googleUser);
	                        console.log(state);
	                    }.bind(this));
	                } else {
	                    auth2.signOut().then(function () {
	                        console.log('User signed out.');
	                    });
	                }
	            }.bind(this));
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

/***/ }

})