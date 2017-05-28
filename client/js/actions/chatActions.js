import axios from "axios";

export function setDestMessage(destUser) {
    return {
        type: "UPDATE_DEST_USER",
        payload: destUser
    };
}
export function setChatOpen(opened) {
    return {
        type: "UPDATE_OPEN",
        payload: opened
    };
}
export function setUnreadChats(chats) {
    return {
        type: "UPDATE_UNREAD_CHATS",
        payload: chats
    };
}

export function fetchChats() {
    return function(dispatch) {
        axios.get('/fetchChats')
        .then((res) => {
            dispatch({
                type: "FETCH_CHATS_SUCCESS",
                payload: res.data
            });

            const areaChat = document.getElementById("listChatComment");
            if (areaChat) {
                areaChat.scrollTop = areaChat.scrollHeight;
            }
        })
        .catch((e) => {
            console.log(e);
        });
    };
}


export function sendChatMessage(FormChat, destUserId, com) {
    return function(dispatch) {
        axios.post('/sendChatMessage', {
            destUserId: destUserId,
            content: com,
        })
        .then((res) => {
            console.log("send chat");
            console.log(res.data);
            FormChat.props.fetchChats();
        })
        .catch((e) => {
            console.log(e);
        });
    };
}

export function readChat(ListChat, chatId) {
    return function(dispatch) {
        axios.post('/readChat', {
            id: chatId,
        })
        .then((res) => {
            ListChat.props.fetchChats();
        })
        .catch((e) => {
            console.log(e);
        });
    };
}
