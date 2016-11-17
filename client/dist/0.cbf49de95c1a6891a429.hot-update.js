webpackHotUpdate(0,{

/***/ 249:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _react = __webpack_require__(78);

	var _react2 = _interopRequireDefault(_react);

	var _google = __webpack_require__(250);

	var _google2 = _interopRequireDefault(_google);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import FacebookLogin from '../build/react-facebook-login/src/facebook';
	//
	// const responseFacebook = (response) => {
	//     console.log(response);
	// };
	var Header = _react2.default.createClass({
	    displayName: 'Header',

	    componentDidMount: function componentDidMount() {
	        window.fbAsyncInit = function () {
	            FB.init({
	                appId: '<YOUR_APP_ID>', cookie: true, // enable cookies to allow the server to access
	                // the session
	                xfbml: true, // parse social plugins on this page
	                version: 'v2.1' // use version 2.1
	            });

	            // Now that we've initialized the JavaScript SDK, we call
	            // FB.getLoginStatus().  This function gets the state of the
	            // person visiting this page and can return one of three states to
	            // the callback you provide.  They can be:
	            //
	            // 1. Logged into your app ('connected')
	            // 2. Logged into Facebook, but not your app ('not_authorized')
	            // 3. Not logged into Facebook and can't tell if they are logged into
	            //    your app or not.
	            //
	            // These three cases are handled in the callback function.
	            FB.getLoginStatus(function (response) {
	                this.statusChangeCallback(response);
	            }.bind(this));
	        }.bind(this);

	        // Load the SDK asynchronously
	        (function (d, s, id) {
	            var js,
	                fjs = d.getElementsByTagName(s)[0];
	            if (d.getElementById(id)) return;
	            js = d.createElement(s);
	            js.id = id;
	            js.src = "//connect.facebook.net/en_US/sdk.js";
	            fjs.parentNode.insertBefore(js, fjs);
	        })(document, 'script', 'facebook-jssdk');
	    },

	    // Here we run a very simple test of the Graph API after login is
	    // successful.  See statusChangeCallback() for when this call is made.
	    testAPI: function testAPI() {
	        console.log('Welcome!  Fetching your information.... ');
	        FB.api('/me', function (response) {
	            console.log('Successful login for: ' + response.name);
	            document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.name + '!';
	        });
	    },

	    // This is called with the results from from FB.getLoginStatus().
	    statusChangeCallback: function statusChangeCallback(response) {
	        console.log('statusChangeCallback');
	        console.log(response);
	        // The response object is returned with a status field that lets the
	        // app know the current login status of the person.
	        // Full docs on the response object can be found in the documentation
	        // for FB.getLoginStatus().
	        if (response.status === 'connected') {
	            // Logged into your app and Facebook.
	            this.testAPI();
	        } else if (response.status === 'not_authorized') {
	            // The person is logged into Facebook, but not your app.
	            document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
	        } else {
	            // The person is not logged into Facebook, so we're not sure if
	            // they are logged into this app or not.
	            document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
	        }
	    },

	    // This function is called when someone finishes with the Login
	    // Button.  See the onlogin handler attached to it in the sample
	    // code below.
	    checkLoginState: function checkLoginState() {
	        FB.getLoginStatus(function (response) {
	            this.statusChangeCallback(response);
	        }.bind(this));
	    },

	    handleClick: function handleClick() {
	        FB.login(this.checkLoginState());
	    },

	    render: function render() {
	        return _react2.default.createElement(
	            'nav',
	            { className: 'navbar navbar-default home' },
	            _react2.default.createElement(
	                'div',
	                { className: 'navbar-header' },
	                _react2.default.createElement(
	                    'a',
	                    { className: 'navbar-brand', href: '#' },
	                    'Miyukip'
	                )
	            ),
	            _react2.default.createElement(
	                'div',
	                { className: 'navbar-collapse', id: 'bs-example-navbar-collapse-1' },
	                _react2.default.createElement(
	                    'ul',
	                    { className: 'nav navbar-nav navbar-right' },
	                    _react2.default.createElement(
	                        'li',
	                        null,
	                        _react2.default.createElement(_google2.default, null)
	                    ),
	                    _react2.default.createElement(
	                        'li',
	                        { className: 'dropdown' },
	                        _react2.default.createElement(
	                            'a',
	                            { href: '#', className: 'dropdown-toggle', 'data-toggle': 'dropdown', role: 'button', 'aria-haspopup': 'true', 'aria-expanded': 'false' },
	                            'Vous avez d\xE9j\xE0 un compte ? Connexion',
	                            _react2.default.createElement('span', { className: 'caret' })
	                        ),
	                        _react2.default.createElement(
	                            'div',
	                            { id: 'dropdown-div', className: 'dropdown-menu' },
	                            _react2.default.createElement(
	                                'form',
	                                { action: '#', method: 'post' },
	                                _react2.default.createElement(
	                                    'p',
	                                    null,
	                                    _react2.default.createElement(
	                                        'label',
	                                        null,
	                                        'D\xE9j\xE0 inscrit ?'
	                                    )
	                                ),
	                                _react2.default.createElement('input', { id: 'user_username', className: 'form-control', type: 'text', placeholder: 'Username', size: '30' }),
	                                _react2.default.createElement('input', { id: 'user_password', className: 'form-control', type: 'password', placeholder: 'Password', size: '30' }),
	                                _react2.default.createElement(
	                                    'button',
	                                    { id: 'dropdown-login', type: 'submit', className: 'btn btn-primary' },
	                                    'Connexion'
	                                ),
	                                _react2.default.createElement('hr', { id: 'sep', className: 'separator' }),
	                                _react2.default.createElement(
	                                    'p',
	                                    null,
	                                    _react2.default.createElement(
	                                        'label',
	                                        null,
	                                        'Nouveau sur Museetic ?'
	                                    )
	                                ),
	                                _react2.default.createElement(
	                                    'button',
	                                    { id: 'dropdown-login', type: 'submit', className: 'btn btn-success' },
	                                    'Inscription'
	                                )
	                            )
	                        )
	                    )
	                )
	            )
	        );
	    }
	});

	exports.default = Header;

/***/ },

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
	                var res = googleUser.getBasicProfile();
	            } else {
	                console.log(googleUser.status);
	            }
	            // console.log(googleUser.getBasicProfile());
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

/***/ },

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