const initialState = {
	artTrend: null,
    artsProfile: null
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case "ARTTREND_SUCCESS":
			return {
				...state,
				artTrend: action.payload
			};
		case "LIKE_ART_TREND_SUCCESS":
			return {
				...state,
				artTrend: {
					...state.artTrend,
					likes: action.payload
				}
			};
		case "UNLIKE_ART_PROFILE_SUCCESS": {
            const artsProfile = [...state.artsProfile];
            artsProfile.splice(action.payload, 1);
            return {
                ...state,
                artsProfile: artsProfile,
            };
        }
		case "FETCH_ARTS_PROFILE_SUCCESS":
			return {
				...state,
				artsProfile: action.payload
			};
	}

	return state;
}
