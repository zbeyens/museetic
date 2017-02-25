import axios from "axios";
import {
    browserHistory
} from 'react-router';
// import { SubmissionError } from 'redux-form';

export function loadAuth() {
    return function(dispatch) {
        dispatch({
            type: "LOAD_REQUEST",
        })
        return axios.get('/loadAuth')
            .then((res) => {
                console.log("loaded");
                // console.log(res);
                dispatch({
                    type: "LOAD_SUCCESS",
                    payload: res.data,
                });
            })
            .catch((e) => {
                console.log(e);
                dispatch({
                    type: "LOAD_ERROR",
                    payload: e,
                });
            });
    }
}

/**
 * SIGNUP
 * @param  {object} values : {name, email, password}
 * @return {action}
 */
export function signup(values) {
    return function(dispatch) {
        axios.post('/signup', {
                name: values.name,
                email: values.email,
                password: values.password
            })
            .then((res) => {
                dispatch({
                    type: "LOGIN_SUCCESS",
                    payload: res.data
                });

                browserHistory.push('/');

                // if (res.data.loggedIn) {
                //
                //     // - Save the JWT in localStorage (response.data.token)
                //     localStorage.setItem('token', response.data.loggedIn);
                // }
            })
            .catch((e) => {
                //should put wrong logs here
                console.log(e);
                dispatch({
                    type: "SIGNUP_ERROR",
                    payload: e.response.data,
                });
            });
    }
};


/**
 * LOGIN
 * @param  {object} log : {email, password}
 * @return {action}
 */
export function login(values) {
    return function(dispatch) {
        var test = axios.post('/login', {
                email: values.email,
                password: values.password
            })
            .then((res) => {
                dispatch({
                    type: "LOGIN_SUCCESS",
                    payload: res.data
                });

                browserHistory.push('/');
                //     // - Save the JWT in localStorage (response.data.token)
                //     localStorage.setItem('token', response.data.loggedIn);
                // }
            })
            .catch((e) => {
                console.log(e);
                dispatch({
                    type: "LOGIN_ERROR",
                    payload: e.response.data,
                });
            });
    }
};

export function logout() {
    return function(dispatch) {
        axios.post('/logout')
            .then((res) => {
                dispatch({
                    type: "LOGOUT_SUCCESS",
                });

                // localStorage.setItem('token', null);
            })
            .catch((e) => {
                console.log('error logout');
                // dispatch({
                //     type: "LOGIN_ERROR",
                //     payload: e,
                // })
            });
    }
}

export function loginFacebook() {
    return function(dispatch) {
        //size of the popup
        var w = 500;
        var h = 300;
        //screenXY: position of current monitor
        //screen: monitors
        var left = window.screenX + (screen.width / 2) - (w / 2);
        var top = window.screenY + (screen.height / 2) - (h / 2);
        var win = window.open('/auth/facebook', 'popUpWindow', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
        var intervalID = setInterval(() => {
            if (win.closed) {
                // console.log(this.props.dispatch());

                //***** DO MY after login code.********
                clearInterval(intervalID);
            }
        }, 100);
        axios.post('/signup', {
                email: log.email,
                password: log.password
            })
            .then((res) => {
                if (res.data.loggedIn) {
                    dispatch({
                        type: "LOGIN",
                        payload: res.data.loggedIn,
                    });
                }
            })
            .catch((e) => {
                console.log('errors');
                dispatch({
                    type: "LOGIN_ERROR",
                    payload: e,
                });
            });
    }
};
