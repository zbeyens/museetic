import axios from "axios";

export function fetchArtTrend() {
    return function(dispatch) {
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
            });
    };
}
