import { browserHistory } from 'react-router';
import axios from "axios";


export function fetchMuseum(id) {
    return function(dispatch) {
        dispatch({
            type: "FETCH_MUSEUM_REQUEST",
        });

        axios.get('/fetchMuseum?id=' + id)
        .then((res) => {
            dispatch({
                type: "FETCH_MUSEUM_SUCCESS",
                payload: res.data,
            });

            //NOTE: google map
            const geocodeAddress = (address, geocoder, resultsMap) => {
                geocoder.geocode({address: address}, (results, status) => {
                    if (status === 'OK') {
                        resultsMap.setCenter(results[0].geometry.location);
                        new google.maps.Marker({
                            map: resultsMap,
                            position: results[0].geometry.location
                        });
                    } else {
                        console.log('Geocode was not successful for the following reason: ' + status);
                    }
                });
            };

            const initMap = (address) => {
                const map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 15,
                    center: {lat: 50.814303, lng: 4.382054} //ULB by default
                });
                const geocoder = new google.maps.Geocoder();

                geocodeAddress(address, geocoder, map);
            };

            initMap(res.data.address);
        })
        .catch((e) => {
            console.log(e);
        });
    };
}

const fetchMuseums = (dispatch, route) => {
    dispatch({
        type: "FETCH_MUSEUMS_REQUEST",
    });

    axios.get(route)
    .then((res) => {
        dispatch({
            type: "FETCH_MUSEUMS_SUCCESS",
            payload: res.data,
        });
    })
    .catch((e) => {
        console.log(e);
    });
};

export function fetchLikedMuseums() {
    return function(dispatch) {
        dispatch({
            type: "FETCH_MUSEUMS_REQUEST",
        });

        axios.get('fetchmycollection')
        .then((res) => {
            const museums = [];
            const arts = res.data;

            //take all different museums that the user likes
            for (let i = 0; i < arts.length; i++) {
                let inside = false;
                for (let j = 0; j < museums.length; j++) {
                    if (museums[j]._id === arts[i].museum._id) {
                        inside = true;
                    }
                }
                if (!inside) {
                    museums.push(arts[i].museum);
                }
            }

            dispatch({
                type: "FETCH_MUSEUMS_SUCCESS",
                payload: museums,
            });
        })
        .catch((e) => {
            console.log(e);
        });
    };
}

export function fetchAllMuseums() {
    return function(dispatch) {
        fetchMuseums(dispatch, '/fetchAllMuseums');
    };
}

export function addMuseum(values) {
    return function(dispatch) {
        //for file uploading, json -> formdata
        const formData = new FormData();

        Object.keys(values).forEach((key,index) => {
            if (key === 'pdf') {
                formData.append(key, values[key][0]);
            } else {
                formData.append(key, values[key]);
            }
        });


        axios.post('/addMuseum', formData)
        .then((res) => {
            browserHistory.push('/museum/' + res.data);
        })
        .catch((e) => {
            console.log(e);
        });
    };
}
export function editMuseum(id, values) {
    return function(dispatch) {
        const formData = new FormData();

        Object.keys(values).forEach((key,index) => {
            formData.append(key, values[key]);
        });
        formData.append('id', id);


        axios.post('/editMuseum', formData)
        .then((res) => {
            window.location.reload();
            // browserHistory.push('/museum/' + res.data);
        })
        .catch((e) => {
            console.log(e);
        });
    };
}

export function removeMuseum(id) {
    return function(dispatch) {
        axios.post('/removeMuseum', {
            id: id
        })
        .then((res) => {
            browserHistory.push('/museums');
        })
        .catch((e) => {
            console.log(e);
        });
    };
}
