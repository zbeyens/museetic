const initialState = {
    listMuseum: [],
    museumProfile: null,
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
        case "FETCH_MUSEUMS_REQUEST":
            return {
                ...state,
                listMuseum: [],
            };
        case "FETCH_MUSEUMS_SUCCESS":
            return {
                ...state,
                listMuseum: action.payload,
            };
        case "FETCH_MUSEUM_REQUEST":
            return {
                ...state,
                museumProfile: null,
            };
        case "FETCH_MUSEUM_SUCCESS":
            return {
                ...state,
                museumProfile: action.payload,
            };
	}

	return state;
}
