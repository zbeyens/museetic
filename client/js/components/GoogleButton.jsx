import React from 'react';

class GoogleButton extends React.Component {
    //oRnhywks5PZ4_9NHqlVd-h9F
    constructor(props, context) {
        super(props, context);
        this.clickHandler = this.clickHandler.bind(this);
    }

    // responseGoogle(googleUser) {
    // }

    clickHandler() {
        //size of the popup
        const w = 500;
        const h = 300;
        //screenXY: position of current monitor
        //screen: monitors
        const left = window.screenX + (screen.width/2)-(w/2);
        const top = window.screenY + (screen.height/2)-(h/2);
        const win = window.open('/auth/facebook','popUpWindow', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
        const intervalID = setInterval(() => {
            if (win.closed) {
                //***** DO MY after login code.********
                clearInterval(intervalID);
            }
        }, 100);
    }

    render() {
        return (
            <div className="socialDiv">
                <button className="btn btn-block btn-social btn-google"
                    onClick={this.clickHandler}
                    disabled="disabled">
                    <i className="fa fa-google"/> {this.props.buttonText}
                </button>
            </div>
        );
    }

}

export default GoogleButton;
