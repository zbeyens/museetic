// <div className={this.props.class} data-onlogin={this.checkLoginState.bind(this)} data-scope="basic_info" data-max-rows="1" data-size="large" data-show-faces="false" data-auto-logout-link="true"></div>

<div>
    <GoogleLogin class="google-login" scope="profile" responseHandler={this.responseGoogle} buttonText="Login With Google" socialId="119719318456-ohdb4e11na4ohkggtgs91rtmibk2d4c9.apps.googleusercontent.com"/>
</div>

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
