import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchChats, setChatOpen, setUnreadChats } from '../../actions/chatActions';
// import styles from './ModalMessages.scss';

@connect(
    state => ({
        user: state.auth.user,
        destUser: state.chat.destUser,
        unreadChats: state.chat.unreadChats,
        listChat: state.chat.listChat
    }),
    dispatch => bindActionCreators({
        fetchChats,
        setChatOpen,
        setUnreadChats,
    }, dispatch)
)
class ModalMessages extends Component {
    constructor(props) {
        super(props);
        this.handleOpen = this.handleOpen.bind(this);
    }

    componentDidMount() {
        this.fetchChatsInt = setInterval(() => {
            this.props.fetchChats(); //NOTE: CAN INCLUDE IN INTERVAL
            //check if self read the message
            const unreadChats = [];
            for (let i = 0; i < this.props.listChat.length; i++) {
                for (let j = 0; j < this.props.listChat[i].participants.length; j++) {
                    const participant = this.props.listChat[i].participants[j];
                    if (participant.user._id === this.props.user._id) {
                        if (!participant.read) {
                            unreadChats.push(this.props.listChat[i]._id);
                        }
                    }
                }
            }
            this.props.setUnreadChats(unreadChats);
        }, 300);
    }

    componentWillUnmount() {
        clearInterval(this.fetchChatsInt);
    }

    handleOpen() {
        this.props.setChatOpen(true);
    }

    render() {
        const { unreadChats } = this.props;
        return (
            <li>
                <a href="javascript:" onClick={this.handleOpen}>
                    <i className="fa fa-envelope fa-lg" /> Messages
                        { unreadChats.length > 0 &&
                            <span className="badge">{unreadChats.length}</span>
                        }
                </a>
            </li>
        );
    }
}

export default ModalMessages;
