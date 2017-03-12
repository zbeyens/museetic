const initialState = {
	inputTime: new Date(),
	loading: false,
	users: [],
	value: ''
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case "FETCH_SUGGESTIONS_SUCCESS":
			return {
				...state,
                loading: false,
				users: action.payload
			};
		case "CLEAR_SUGGESTIONS":
			return {
				...state,
                loading: false,
				users: []
			};
		case "UPDATE_INPUT":
			return {
				...state,
				inputTime: new Date(),
                loading: true,
				value: action.payload
			};
	}

	return state;
}
