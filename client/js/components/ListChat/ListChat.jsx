import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import {darkBlack} from 'material-ui/styles/colors';
import { fetchChats, setDestMessage } from '../../actions/chatActions';

// import styles from './ListChat.scss';


@connect(
    state => ({
        user: state.auth.user,
        listChat: state.chat.listChat,
    }),
    dispatch => bindActionCreators({
        fetchChats,
        setDestMessage
    }, dispatch)
)
class ListChat extends Component {
    constructor(props) {
        super(props);
        this.onClickChat = this.onClickChat.bind(this);
    }

    componentDidMount() {
        this.props.fetchChats();
    }

    onClickChat(destUser) {
        this.props.setDestMessage(destUser);
    }

    render() {
        const { listChat, user } = this.props;

        const destUsers = [];
        for (let i = 0; i < listChat.length; i++) {
            for (let j = 0; j < listChat[i].participants.length; j++) {
                if (listChat[i].participants[j].user._id !== user._id) {
                    destUsers.push(listChat[i].participants[j].user);
                }
            }
        }

        return (
            <List>
                {listChat.map((chat, i) => (
                    <div key={chat._id}>
                        <ListItem
                            leftAvatar={<Avatar src="client/img/user-image32.png" />}
                            primaryText={<span style={{color: '#e04e3e'}}>{destUsers[i].name}</span>}
                            secondaryText={
                                chat.messages.length > 0 &&
                                <p>
                                    <span style={{color: darkBlack}}>{chat.messages[chat.messages.length-1].author.name + " -- "}</span>
                                    {chat.messages[chat.messages.length-1].content}
                                </p>
                            }
                            secondaryTextLines={2}
                            onTouchTap={() => this.onClickChat(destUsers[i])}
                        />
                        <Divider inset />
                    </div>
                ))}
            </List>
        );
    }
}

export default ListChat;
