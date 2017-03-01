import React, {Component} from 'react';
import { connect } from 'react-redux';
import { loadAuth } from '../actions/authActions';

@connect((state) => {
    return {loadAuth};
})

class FacebookButton extends Component {
    constructor(props, context) {
        super(props, context);
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler() {
        // this.props.dispatch(loginFacebook);

        const url = '/auth/facebook';
        const name = 'facebook_login';
        const w = 500;
        const h = 500;
        // //screenXY: position of current monitor
        // //screen: monitors
        const wLeft = window.screenLeft ? window.screenLeft : window.screenX;
        const wTop = window.screenTop ? window.screenTop : window.screenY;
        const left = wLeft + (window.innerWidth / 2) - (w / 2);
        const top = wTop + (window.innerHeight / 2) - (h / 2);
        const specs = 'width='+w+',height='+h+',top='+top+', left='+left;
        const win = window.open(url, name, specs);
        // const left = window.screenX + (screen.width/2)-(w/2);
        // const top = window.screenY + (screen.height/2)-(h/2);
        // const win = window.open('/auth/facebook','popUpWindow', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
        const intervalID = setInterval(() => {
            if (win.closed) {
                this.props.dispatch(loadAuth());
                //***** DO MY after login code.********
                clearInterval(intervalID);
            }
        }, 100);
    }

    render() {
        return (
            <div className={this.props.divClass}>

                <button className="btn btn-block btn-social btn-facebook"
                    onClick={this.clickHandler}
                    disabled="disabled">
                    <i className="fa fa-facebook"/> {this.props.buttonText}
                </button>

            </div>
        );
    }

}

export default FacebookButton;

// function setCookie(name,value,days) {
//     const date = new Date();
//     date.setTime(date.getTime()+(days*24*60*60*1000));
//     const expires = "; expires="+date.toGMTString();
//     document.cookie = name+"="+value+expires+"; path=/";
// }
//
// function getCookie(name) {
//     const nameEQ = name + "=";
//     const ca = document.cookie.split(';');
//     let i;
//     for (i=0; i < ca.length; i++) {
//         let c = ca[i];
//         while (c.charAt(0) ===' ') c = c.substring(1,c.length);
//         if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
//     }
//     return null;
// }
//
// function deleteCookie(name) {
//     setCookie(name,"",-1);
// }
