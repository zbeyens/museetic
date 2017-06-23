import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import {darkBlack} from 'material-ui/styles/colors';
import { fetchChats, readChat, setDestMessage, setUnreadChats } from '../../actions/chatActions';

// import styles from './ListChat.scss';


@connect(
    state => ({
        user: state.auth.user,
        listChat: state.chat.listChat,
        unreadChats: state.chat.unreadChats,
    }),
    dispatch => bindActionCreators({
        fetchChats,
        readChat,
        setDestMessage,
        setUnreadChats
    }, dispatch)
)
class ListChat extends Component {
    constructor(props) {
        super(props);
        this.onClickChat = this.onClickChat.bind(this);
    }

    onClickChat(chatId, destUser) {
        this.props.readChat(this, chatId);
        this.props.setDestMessage(destUser);
    }

    render() {
        const { unreadChats, listChat, user } = this.props;

        const destUsers = [];
        for (let i = 0; i < listChat.length; i++) {
            for (let j = 0; j < listChat[i].participants.length; j++) {
                if (listChat[i].participants[j] &&
                    listChat[i].participants[j].user &&
                    listChat[i].participants[j].user._id !== user._id) {
                    destUsers.push(listChat[i].participants[j].user);
                }
            }
        }

        const isRead = (chat) => {
            if (!unreadChats.includes(chat._id)) {
                return true;
            } else {
                return false;
            }
        };

        return (
            <List>
                {listChat.map((chat, i) => (
                    <div key={chat._id}>
                        <ListItem
                            leftAvatar={<Avatar src={destUsers[i].picture} />}
                            primaryText={<span style={{color: '#e04e3e'}}>{destUsers[i].name}</span>}
                            secondaryText={
                                chat.messages.length > 0 &&
                                <div>
                                    {isRead(chat) &&
                                        <div>
                                            <span style={{color: darkBlack}}>{chat.messages[chat.messages.length-1].author.name + " -- "}</span>
                                            <span>{chat.messages[chat.messages.length-1].content}</span>
                                        </div>
                                    }
                                    {!isRead(chat) &&
                                        <div>
                                            <strong style={{color: darkBlack}}>{chat.messages[chat.messages.length-1].author.name + " -- "}</strong>
                                            <strong>{chat.messages[chat.messages.length-1].content}</strong>
                                        </div>
                                    }
                                </div>
                            }
                            secondaryTextLines={2}
                            onTouchTap={() => this.onClickChat(chat._id, destUsers[i])}
                        />
                        <Divider inset />
                    </div>
                ))}
            </List>
        );
    }
}

export default ListChat;
