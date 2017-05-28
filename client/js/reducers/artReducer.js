const initialState = {
	artProfile: null,
    listArts: null,
    jump: false,
    comments: [],
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case "FETCH_ARTTREND_REQUEST":
			return {
				...state,
				artProfile: null,
			};
		case "FETCH_ARTTREND_SUCCESS":
			return {
				...state,
				artProfile: action.payload
			};
		case "LIKE_ART_SUCCESS":
			return {
				...state,
				artProfile: {
					...state.artProfile,
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

		case "FETCH_ART_REQUEST":
			return {
				...state,
				artProfile: null,
			};
		case "FETCH_ART_SUCCESS":
			return {
				...state,
				artProfile: action.payload,
			};

        case "JUMP_COMMENT": {
            return {
                ...state,
                jump: action.payload,
            };
        }
        case "FETCH_COMMENTS_SUCCESS": {
            return {
                ...state,
                comments: action.payload,
            };
        }
	}

	return state;
}
