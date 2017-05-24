const initialState = {
    //search bar
	inputTime: new Date(),
	loading: false,
    suggestions: [],
    userProfile: null,
	value: '',
    //Notifications
    listNotif: [],
    listFriends: [],
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case "FETCH_SUGGESTIONS_SUCCESS": {
            return {
                ...state,
                loading: false,
                suggestions: action.payload,
            };
        }
        case "FETCH_USER_PROFILE_REQUEST":
            return {
                ...state,
                userProfile: null,
            };
        case "FETCH_USER_PROFILE_SUCCESS":
            return {
                ...state,
                userProfile: action.payload,
            };
        case "FETCH_NOTIFICATIONS_SUCCESS":
            return {
                ...state,
                listNotif: action.payload,
            };
        case "FETCH_FRIENDS_REQUEST":
            return {
                ...state,
                listFriends: null,
            };
        case "FETCH_FRIENDS_SUCCESS":
            return {
                ...state,
                listFriends: action.payload,
            };
		case "CLEAR_SUGGESTIONS":
			return {
				...state,
                loading: false,
				suggestions: []
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
