import React from 'react';
import FacebookLogin from './lib/FacebookLogin.jsx';

class Facebook extends React.Component {
    //oRnhywks5PZ4_9NHqlVd-h9F
    constructor(props, context) {
        super(props, context);
    }

    responseFacebook(response) {
        console.log(response);
    }

    render() {
        return (
            <div>

                <FacebookLogin
                    socialId="1631923003767295"
                    language="en_US"
                    scope="public_profile,email"
                    fields="name,email,picture"
                    responseHandler={this.responseFacebook}
                    xfbml={true}
                    version="v2.8"
                    class="my-facebook-button-class"
                    icon="fa-facebook"
                    buttonText="Login with Facebook"/>

            </div>
        );
    }

}

export default Facebook;
