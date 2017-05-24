import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { loadAuth } from '../../actions/authActions';
import { fetchNotifications, acceptFriend, declineFriend } from '../../actions/userActions';
// import styles from './BtnFriendContainer.scss';


@connect(
    state => ({
        loginError: state.auth.loginError,
    }),
    dispatch => bindActionCreators({
        loadAuth,
        fetchNotifications,
        acceptFriend,
        declineFriend
    }, dispatch)
)
class BtnComment extends Component {
    constructor(props) {
        super(props);
        this.onClickAccept = this.onClickAccept.bind(this);
        this.onClickDecline = this.onClickDecline.bind(this);
    }

    onClickAccept(notif) {
        this.props.acceptFriend(notif._id, this);
    }
    onClickDecline(notif) {
        this.props.declineFriend(notif._id, this);
    }

    render() {
        const { friend } = this.props;

        return (
            <div>
                <button className="btn btn-success btn-sm"
                    onClick={() => this.onClickAccept(friend)}>
                    Accepter
                </button>
                <button className={"btn btn-default btn-sm margin-l5"}
                    onClick={() => this.onClickDecline(friend)}>
                    Refuser
                </button>
            </div>
        );
    }
}

export default BtnComment;
