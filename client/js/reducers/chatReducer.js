const initialState = {
    open: false,
    destUser: null,
    listChat: [],
    unreadChats: [],
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
        case "UPDATE_DEST_USER":
            return {
                ...state,
                destUser: action.payload,
            };
        case "UPDATE_OPEN":
            return {
                ...state,
                open: action.payload,
            };
        case "UPDATE_UNREAD_CHATS":
            return {
                ...state,
                unreadChats: action.payload,
            };
        case "FETCH_CHATS_SUCCESS":
            return {
                ...state,
                listChat: action.payload,
            };
	}

	return state;
}
