import React, {Component} from 'react'
import Google from './google.jsx';
import Facebook from './facebook.jsx';
import ProfileButton from './ProfileButton.jsx';
// import FacebookLogin from '../build/react-facebook-login/src/facebook';
//
// const responseFacebook = (response) => {
//     console.log(response);
// };
var Header = React.createClass({
    componentDidMount: function() {
        window.fbAsyncInit = function() {
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
            FB.getLoginStatus(function(response) {
                this.statusChangeCallback(response);
            }.bind(this));
        }.bind(this);

        // Load the SDK asynchronously
        (function(d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id))
                return;
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    },

    // Here we run a very simple test of the Graph API after login is
    // successful.  See statusChangeCallback() for when this call is made.
    testAPI: function() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function(response) {
            console.log('Successful login for: ' + response.name);
            document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.name + '!';
        });
    },

    // This is called with the results from from FB.getLoginStatus().
    statusChangeCallback: function(response) {
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
            document.getElementById('status').innerHTML = 'Please log ' +
                'into this app.';
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            document.getElementById('status').innerHTML = 'Please log ' +
                'into Facebook.';
        }
    },

    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
    checkLoginState: function() {
        FB.getLoginStatus(function(response) {
            this.statusChangeCallback(response);
        }.bind(this));
    },

    handleClick: function() {
        FB.login(this.checkLoginState());
    },

    render: function() {
        return (
            <nav className="navbar navbar-default home">
                <div className="navbar-header">
                    <a className="navbar-brand" href="#">Museetic</a>
                </div>

                <div className="navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav navbar-right">
                        <li>
                            <ProfileButton buttonText="Profile"/>
                        </li>
                        <li>
                            <Facebook buttonText="Sign in with Facebook"/>
                        </li>
                        <li>
                            <Google buttonText="Sign in with Google"/>
                        </li>
                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                Vous avez déjà un compte ? Connexion
                                <span className="caret"></span>
                            </a>
                            <div id="dropdown-div" className="dropdown-menu">
                                <form action="#" method="post">
                                    <p>
                                        <label>Déjà inscrit ?</label>
                                    </p>
                                    <input id="user_username" className="form-control" type="text" placeholder="Username" size="30"/>
                                    <input id="user_password" className="form-control" type="password" placeholder="Password" size="30"/>
                                    <button id="dropdown-login" type="submit" className="btn btn-primary">
                                        Connexion
                                    </button>

                                    <hr id="sep" className="separator"/>
                                    <p>
                                        <label>Nouveau sur Museetic ?</label>
                                    </p>
                                    <button id="dropdown-login" type="submit" className="btn btn-success">
                                        Inscription
                                    </button>
                                </form>
                            </div>
                        </li>
                    </ul>
                </div>

            </nav>
        );
    }
});

export default Header;
