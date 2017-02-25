import axios from "axios";
// import {
//     browserHistory
// } from 'react-router';

export function fetchArtTrend() {
    return function(dispatch) {
        // dispatch({
        //     type: "LOAD_REQUEST",
        // })
        return axios.get('/arttrend')
            .then((res) => {
                console.log("fetched art");
                dispatch({
                    type: "ARTTREND_SUCCESS",
                    payload: res.data,
                });
            })
            .catch((e) => {
                console.log(e);
                // dispatch({
                //     type: "LOAD_ERROR",
                //     payload: e,
                // });
            });
    }
}
