import axios from "axios";
import validator from "validator";
import { browserHistory } from 'react-router';

/**
* fetch 1 user from id
* @param  {Object}
*/
export function fetchUserProfile(request, id) {
    return function(dispatch) {
        if (request) {
            dispatch({
                type: "FETCH_ARTS_REQUEST"
            });
            dispatch({
                type: "FETCH_USER_PROFILE_REQUEST"
            });
        }
        const param = encodeURIComponent(id);
        axios.get('/search?q=' + param).then((res) => {
            console.log("fetched users");
            console.log(res.data);
            const profile = res.data;
            if (profile) {
                dispatch({
                    type: "FETCH_ARTS_SUCCESS",
                    payload: profile.arts
                });
                dispatch({
                    type: "FETCH_USER_PROFILE_SUCCESS",
                    payload: profile.user
                });
            }
        }).catch((e) => {
            console.log(e);
            //NOTE: not found
            browserHistory.push('/');
        });
    };
}

/**
* fetch suggestions of users from a portion of name
* @param  {String} value : portion of name
* @param  {Bool} typed : did typed recently ?
*/
export function fetchSuggestions(value, typed) {
    return function(dispatch) {
        const param = encodeURIComponent(value);
        axios.get('/suggestions?q=' + param).then((res) => {
            console.log("fetched suggestions");
            const suggestions = res.data;
            dispatch({
                type: "FETCH_SUGGESTIONS_SUCCESS",
                payload: suggestions
            });
        }).catch((e) => {
            console.log(e);
        });
    };
}

/**
* update "value" or clear each time typing
* @param  {String} value : portion of name
*/
export function updateInput(value) {
    const param = validator.trim(value);
    if (!param) {
        return {type: "CLEAR_SUGGESTIONS"};
    }

    return {type: "UPDATE_INPUT", payload: value};
}

//value: id
export function addFriend(value, UserProfile) {
    return function(dispatch) {
        const param = encodeURIComponent(value);
        axios.get('/addFriend?q=' + param).then((res) => {
            UserProfile.props.fetchUserProfile(0, UserProfile.props.params.id);
        }).catch((e) => {
            console.log(e);
        });
    };
}
//value: id
export function removeFriend(value, UserProfile) {
    return function(dispatch) {
        axios.get('/removeFriend?q=' + value).then((res) => {
            UserProfile.props.loadAuth();
        }).catch((e) => {
            console.log(e);
        });
    };
}

export function fetchNotifications() {
    return function(dispatch) {
        axios.get('/fetchNotifications').then((res) => {
            console.log("fetched notif");
            dispatch({
                type: "FETCH_NOTIFICATIONS_SUCCESS",
                payload: res.data
            });
        }).catch((e) => {
            console.log(e);
        });
    };
}

export function fetchFriends() {
    return function(dispatch) {
        dispatch({
            type: "FETCH_FRIENDS_REQUEST",
        });
        axios.get('/fetchFriends').then((res) => {
            dispatch({
                type: "FETCH_FRIENDS_SUCCESS",
                payload: res.data
            });
        }).catch((e) => {
            console.log(e);
        });
    };
}

export function acceptFriend(id, Notifications) {
    return function(dispatch) {
        axios.get('/acceptFriend?q=' + id).then((res) => {
            console.log("acceptFriend");
            Notifications.props.fetchNotifications();
            Notifications.props.loadAuth();
        }).catch((e) => {
            console.log(e);
        });
    };
}
export function declineFriend(id, Notifications) {
    return function(dispatch) {
        axios.get('/declineFriend?q=' + id).then((res) => {
            console.log("declineFriend");
            Notifications.props.fetchNotifications();
        }).catch((e) => {
            console.log(e);
        });
    };
}
