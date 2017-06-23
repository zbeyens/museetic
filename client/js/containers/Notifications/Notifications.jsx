import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';

import { loadAuth } from '../../actions/authActions';
import { fetchNotifications, acceptFriend, declineFriend } from '../../actions/userActions';
import {
    BtnFriendContainer
} from '../../components';
import styles from './Notifications.scss';

@connect(
    state => ({
        listNotif: state.user.listNotif,
    }),
    dispatch => bindActionCreators({
        loadAuth,
        fetchNotifications,
        acceptFriend,
        declineFriend
    }, dispatch)
)
class Notifications extends Component {
    componentDidMount() {
        this.fetchNotifInt = setInterval(() => {
            this.props.fetchNotifications();
            this.props.loadAuth();
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.fetchNotifInt);
    }

    render() {
        const { listNotif } = this.props;

        return (
            <div>
                { listNotif && listNotif.length > 0 &&
                    <Paper className={"col-xs-6 col-xs-offset-3 " + styles.cont} zDepth={1}>
                        <ul className="notifications">
                            {listNotif.map((notif, i) =>
                                <li key={notif._id} className="notification">
                                    <div className="media">
                                        <div className="media-left">
                                            <div className="media-object">
                                                <Avatar
                                                    src={notif.picture}
                                                    className="img-circle"
                                                    size={32}
                                                />
                                            </div>
                                        </div>
                                        <div className="media-body">
                                            <strong className="notification-title">
                                                <Link
                                                    to={'/user/' + notif._id}
                                                    className={styles.a}>
                                                    {notif.name}
                                                </Link>
                                            </strong> veut vous ajouter en ami
                                            <div className={styles.btnContainer}>
                                                <BtnFriendContainer friend={notif}/>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </Paper>
                }
                { listNotif && !listNotif.length &&
                    <h4 className={styles.nothing + " text-center"}>
                        Aucune notification
                    </h4>
                }
            </div>
        );
    }
}

export default Notifications;
