import axios from "axios";
import validator from "validator";
import { browserHistory } from 'react-router';

/**
 * fetch 1 user from id
 * @param  {Object}
 */
export function fetchUserProfile(id) {
    return function(dispatch) {
        dispatch({
            type: "FETCH_ARTS_REQUEST"
        });
        dispatch({
            type: "FETCH_USER_PROFILE_REQUEST"
        });
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
	return function(dispatch) {
		const param = validator.trim(value);
		if (!param) {
			dispatch({type: "CLEAR_SUGGESTIONS"});
			return;
		}

		dispatch({type: "UPDATE_INPUT", payload: value});
	};
}
