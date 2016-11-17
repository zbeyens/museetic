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

	var _GoogleLogin = __webpack_require__(251);

	var _GoogleLogin2 = _interopRequireDefault(_GoogleLogin);

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

	            if (googleUser.isSignedIn()) {
	                var profile = googleUser.getBasicProfile();
	                console.log('ID: ' + profile.getId());
	                console.log('Full Name: ' + profile.getName());
	                console.log('Given Name: ' + profile.getGivenName());
	                console.log('Family Name: ' + profile.getFamilyName());
	                console.log('Image URL: ' + profile.getImageUrl());
	                console.log('Email: ' + profile.getEmail());
	            } else {
	                console.log(googleUser.status);
	            }
	            //anything else you want to do(save to localStorage)...
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return _react2.default.createElement(
	                'div',
	                null,
	                _react2.default.createElement(_GoogleLogin2.default, { 'class': 'google-login', scope: 'profile email', responseHandler: this.responseGoogle, buttonText: 'Login With Google', socialId: '119719318456-ohdb4e11na4ohkggtgs91rtmibk2d4c9.apps.googleusercontent.com' })
	            );
	        }
	    }]);

	    return Login;
	}(_react2.default.Component);

	exports.default = Login;

/***/ }

})