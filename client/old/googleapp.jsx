import React from 'react';
import GoogleLogin from './lib/GoogleLogin.jsx';

class Google extends React.Component {
    //oRnhywks5PZ4_9NHqlVd-h9F
    constructor(props, context) {
        super(props, context);
    }

    responseGoogle(googleUser) {
        var id_token = googleUser.getAuthResponse().id_token;
        console.log({accessToken: id_token});

        if (googleUser.isSignedIn()) {
            $.ajax({
                url: '/api',
                type: "POST",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                },
                data: {
                    id_token: id_token
                },
                success: function(data) {
                    // this.setState({data: data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error("aie", status, err.toString());
                }.bind(this)
            });

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

    render() {
        return (
            <div>
                <a href="/profile" className="btn btn-block btn-social btn-google"
                    onClick={this.clickHandler}>
                    <i className="fa fa-google"></i> {this.props.buttonText}
                </a>
            </div>
        );
    }

}

export default Google;
