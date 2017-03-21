import axios from "axios";

export function fetchArtTrend() {
    return function(dispatch) {
        axios.get('/arttrend')
        .then((res) => {
            console.log("fetched art");
            dispatch({
                type: "ARTTREND_SUCCESS",
                payload: res.data,
            });
        })
        .catch((e) => {
            console.log(e);
        });
    };
}

/**
 * recv artTrend.likes: check if selfUser id is inside to like or unlike
 * @param  {ObjectId} id : artId
 */
export function likeArtTrend(id) {
    return function(dispatch) {
        const param = encodeURIComponent(id);
        axios.get('/likeart?id=' + param)
        .then((res) => {
            console.log("liked art");
            console.log(res.data);
            dispatch({
                type: "LIKE_ART_TREND_SUCCESS",
                payload: res.data.likes,
            });
        })
        .catch((e) => {
            console.log(e);
        });
    };
}

/**
 * recv artTrend.likes: check if selfUser id is inside to like or unlike
 * @param  {ObjectId} id : artId
 */
export function likeArtProfile(id, i) {
    return function(dispatch) {
        const param = encodeURIComponent(id);
        axios.get('/likeart?id=' + param)
        .then((res) => {
            console.log("liked art");
            console.log(res.data);
            if (res.data.undo) {
                dispatch({
                    type: "UNLIKE_ART_PROFILE_SUCCESS",
                    payload: i,
                });
            } else {
                dispatch({
                    type: "LIKE_ART_PROFILE_SUCCESS",
                    payload: {
                        likes: res.data.likes,
                        idx: i,
                    }
                });
            }
        })
        .catch((e) => {
            console.log(e);
        });
    };
}
