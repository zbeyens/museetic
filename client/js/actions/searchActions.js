import axios from "axios";
import validator from "validator";

export function search(value, typed) {
    return function(dispatch) {
        const param = encodeURIComponent(value);
        console.log("param: ");
        console.log(param);
        axios.get('/search?q=' + param).then((res) => {
            console.log("fetched users");
            const users = res.data;
            const usersName = users.map((user) => {
                return user.name;
            });
            dispatch({type: "FETCH_SUGGESTIONS_SUCCESS", payload: usersName});
        }).catch((e) => {
            console.log(e);
        });
    };
}

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
