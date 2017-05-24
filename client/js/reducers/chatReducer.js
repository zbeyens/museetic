const initialState = {
    destUser: null,
    listChat: [],
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
        case "UPDATE_DEST_USER":
            return {
                ...state,
                destUser: action.payload,
            };
        case "FETCH_CHATS_SUCCESS":
            return {
                ...state,
                listChat: action.payload,
            };
	}

	return state;
}
