import React from 'react';
import autoBind from 'react-autobind';

export default class FacebookLogin extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        //load the SDK asynchronously
        (function(d, s, id) {
            const element = d.getElementsByTagName(s)[0];
            const fjs = element;
            let js = element;
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = '//connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        var self = this;
        window.onload = function() {
            window.fbAsyncInit = () => {
                FB.init({appId: self.props.socialId, xfbml: self.props.xfbml, cookie: self.props.cookie, version: self.props.version});
                FB.getLoginStatus(function(resp) {
                    console.log(resp);
                });

            };
        };
    }

    responseApi(authResponse) {
        FB.api('/me', {
            fields: this.props.fields
        }, (me) => {
            me.accessToken = authResponse.accessToken;
            this.props.responseHandler(me);
        });
    }

    checkLoginState(response) {
        console.log("yo");
        if (response.authResponse) {
            this.responseApi(response.authResponse);
        } else {
            if (this.props.responseHandler) {
                this.props.responseHandler({status: response.status});
            }
        }
    }

    clickHandler() {
        FB.getLoginStatus(function(response) {
            if (response.authResponse) {
                console.log("hu");
                FB.logout();
            } else {
                FB.login(this.checkLoginState, {scope: this.props.scope});
            }
        }.bind(this));
    }

    render() {
        return (
            <div>
                <button
                    className={this.props.class}
                    onClick={this.clickHandler}>
                    {this.props.buttonText}
                </button>
            </div>
        );
    }
}
