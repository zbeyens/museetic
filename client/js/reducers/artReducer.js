const initialState = {
    artTrend: null,
};


export default function reducer(state = initialState, action) {
    switch (action.type) {
        // case "ARTTREND_REQUEST":
        //     return {
        //         ...state,
        //         // loading: true,
        //     };
        case "ARTTREND_SUCCESS":
            return {
                ...state,
                artTrend: action.payload
            };
    }

    return state;
};
