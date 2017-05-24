import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import Divider from 'material-ui/Divider';

// import { fetchComments } from '../../actions/chatActions';
import styles from './ListChatComment.scss';

@connect(
    state => ({
        user: state.auth.user,
        destUser: state.chat.destUser,
        listChat: state.chat.listChat,
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)
class ListChatComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            now: new Date(),
            listChatComment: {},
        };
    }

    componentDidMount() {
        this.time = setInterval(() => {
            this.setState({now: new Date()});
        }, 1000);

        //use ref, id is bad if multiple instances
        const list = document.getElementById("listChatComment");
        if (list) {
            list.scrollTop = list.scrollHeight;
        }
    }

    componentWillUnmount() {
        clearInterval(this.time);
    }

    render() {
        moment.locale('fr');

        const {listChat, destUser} = this.props;

        let listChatComment = {};
        if (destUser) {
            for (let i = 0; i < listChat.length; i++) {
                for (let j = 0; j < listChat[i].participants.length; j++) {
                    if (listChat[i].participants[j].user._id === destUser._id) {
                        listChatComment = listChat[i];
                        break;
                    }
                }
            }
        }

        return (
            <div className={styles.commentsCtn} id="listChatComment">
                { listChatComment.messages &&
                    listChatComment.messages.map((com, i) => (
                        <div key={com._id}>
                            <Divider />
                            <div className={"margin-10"} >
                                <div className={"margin-r10 " + styles.comLeft}>
                                    <img src="client/img/user-image32.png" alt="" />
                                </div>
                                <div className={styles.comRight}>
                                    <div className={styles.comAuthor}>
                                        <Link to={'/user/' + com.author._id}
                                        className={styles.a}
                                        >
                                            <strong>{com.author.name}</strong>
                                        </Link>
                                        <span className={styles.comDate}> · {moment(com.date).from(this.state.now)}</span>
                                    </div>
                                    <div>{com.content}</div>

                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        );
    }
}

export default ListChatComment;
