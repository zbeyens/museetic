import axios from "axios";

export function fetchArt(id) {
    return function(dispatch) {
        dispatch({
            type: "FETCH_ART_REQUEST",
        });

        const param = encodeURIComponent(id);
        axios.get('/fetchArt?id=' + param)
        .then((res) => {
            dispatch({
                type: "FETCH_ART_SUCCESS",
                payload: res.data,
            });
        })
        .catch((e) => {
            console.log(e);
        });
    };
}

export function fetchArtTrend() {
    return function(dispatch) {
        dispatch({
            type: "FETCH_ARTTREND_REQUEST",
        });
        axios.get('/fetchArtTrend')
        .then((res) => {
            dispatch({
                type: "FETCH_ARTTREND_SUCCESS",
                payload: res.data,
            });
        })
        .catch((e) => {
            console.log(e);
        });
    };
}

export function skipArt() {
    return function(dispatch) {
        axios.get('/skipArt')
        .then((res) => {
            dispatch({
                type: "FETCH_ARTTREND_REQUEST"
            });
            dispatch({
                type: "FETCH_ARTTREND_SUCCESS",
                payload: res.data,
            });
        })
        .catch((e) => {
            console.log(e);
        });
    };
}

export function fetchMyCollection() {
    return function(dispatch) {
        dispatch({
            type: "FETCH_ARTS_REQUEST"
        });

        axios.get('/fetchmycollection')
        .then((res) => {
            dispatch({
                type: "FETCH_ARTS_SUCCESS",
                payload: res.data,
            });
        })
        .catch((e) => {
            console.log(e);
        });
    };
}

/**
* recv currentArt.likes: check if selfUser id is inside to like or unlike
* @param  {ObjectId} id : artId
*/
export function likeArt(id) {
    return function(dispatch) {
        const param = encodeURIComponent(id);
        axios.get('/likeart?id=' + param)
        .then((res) => {
            console.log("liked art");
            dispatch({
                type: "LIKE_ART_SUCCESS",
                payload: res.data.likes,
            });
        })
        .catch((e) => {
            console.log(e);
        });
    };
}

/**
* recv currentArt.likes: check if selfUser id is inside to like or unlike
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
            } else { //NOTE: not used
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

export function jumpComment(bool) {
    return {
        type: 'JUMP_COMMENT',
        payload: bool
    };
}

export function fetchComments(id) {
    return function(dispatch) {
        const param = encodeURIComponent(id);
        axios.get('/fetchComments?id=' + param)
        .then((res) => {
            dispatch({
                type: "FETCH_COMMENTS_SUCCESS",
                payload: res.data
            });
        })
        .catch((e) => {
            console.log(e);
        });
    };
}

export function sendComment(artId, com) {
    return function(dispatch) {
        axios.post('/sendComment', {
            artId: artId,
            content: com,
        })
        .then((res) => {
            dispatch({
                type: "FETCH_COMMENTS_SUCCESS",
                payload: res.data
            });
        })
        .catch((e) => {
            console.log(e);
        });
    };
}

export function deleteComment(artId, comId) {
    return function(dispatch) {
        axios.post('/deleteComment', {
            artId: artId,
            comId: comId,
        })
        .then((res) => {
            dispatch({
                type: "FETCH_COMMENTS_SUCCESS",
                payload: res.data
            });
        })
        .catch((e) => {
            console.log(e);
        });
    };
}
