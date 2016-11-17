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
	                    'Salut'
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

/***/ }

})