import React from 'react';

class ProfileButton extends React.Component {
    //oRnhywks5PZ4_9NHqlVd-h9F
    constructor(props, context) {
        super(props, context);
    }

    responseProfileButton(googleUser) {

    }

    render() {
        return (
            <div>
                <a href="/profile" className="btn btn-block">
                    {this.props.buttonText}
                </a>
            </div>
        );
    }

}

export default ProfileButton;
