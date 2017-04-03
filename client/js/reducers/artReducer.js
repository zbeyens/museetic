const initialState = {
	currentArt: null,
    listArts: null,
    open: false,
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case "FETCH_ARTTREND_REQUEST":
			return {
				...state,
				currentArt: null,
			};
		case "FETCH_ARTTREND_SUCCESS":
			return {
				...state,
				currentArt: action.payload
			};
		case "LIKE_ART_SUCCESS":
			return {
				...state,
				currentArt: {
					...state.currentArt,
					likes: action.payload
				}
			};
		case "UNLIKE_ART_PROFILE_SUCCESS": {
            const listArts = [...state.listArts];
            listArts.splice(action.payload, 1);
            return {
                ...state,
                listArts: listArts,
            };
        }
		case "FETCH_ARTS_REQUEST":
			return {
				...state,
				listArts: null,
			};
		case "FETCH_ARTS_SUCCESS":
			return {
				...state,
				listArts: action.payload
			};
		case "FETCH_ART_SUCCESS":
			return {
				...state,
				currentArt: action.payload,
                open: true,
			};
		case "OPEN_ART":
			return {
				...state,
				open: true,
                currentArt: action.payload,
			};
		case "CLOSE_ART":
			return {
				...state,
				open: false,
			};
	}

	return state;
}
