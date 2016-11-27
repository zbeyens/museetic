import React from 'react';

class FacebookButton extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    responseFacebook(response) {
        console.log(response);
    }

    clickHandler() {
        //size of the popup
        var w = 500;
        var h = 300;
        //screenXY: position of current monitor
        //screen: monitors
        var left = window.screenX + (screen.width/2)-(w/2);
        var top = window.screenY + (screen.height/2)-(h/2);
        var win = window.open('/auth/facebook','popUpWindow', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
        var intervalID = setInterval(function(){
            if (win.closed) {
                //***** DO MY after login code.********
                clearInterval(intervalID);
            }
        }, 100);
    }

    render() {
        return (
            <div className={this.props.divClass}>

                <button className="btn btn-block btn-social btn-facebook"
                    onClick={this.clickHandler}>
                    <i className="fa fa-facebook"></i> {this.props.buttonText}
                </button>

            </div>
        );
    }

}

export default FacebookButton;

function setCookie(name,value,days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
    document.cookie = name+"="+value+expires+"; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function deleteCookie(name) {
    setCookie(name,"",-1);
}
