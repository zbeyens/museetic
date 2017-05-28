import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';

import { fetchFriends } from '../../actions/userActions';
import {
} from '../../components';
import styles from './Friends.scss';

@connect(
    state => ({
        listFriends: state.user.listFriends,
    }),
    dispatch => bindActionCreators({
        fetchFriends
    }, dispatch)
)
class Notifications extends Component {
    componentDidMount() {
        this.props.fetchFriends();
    }

    render() {
        const { listFriends } = this.props;

        return (
            <div>
                { listFriends && listFriends.length > 0 &&
                    <Paper className={"col-xs-6 col-xs-offset-3 " + styles.cont} zDepth={1}>
                        <ul className={styles.notifications + " notifications"}>
                            {listFriends.map((friend, i) =>
                                <li key={friend._id} className="notification">
                                    <div className="media">
                                        <div className="media-left">
                                            <div className="media-object">
                                                <Avatar
                                                    src={friend.picture}
                                                    className="img-circle"
                                                    size={32}
                                                />
                                            </div>
                                        </div>
                                        <div className="media-body">
                                            <strong className="notification-title">
                                                <Link
                                                    to={'/user/' + friend._id}
                                                    className={styles.a}>
                                                    {friend.name}
                                                </Link>
                                            </strong>
                                        </div>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </Paper>
                }
                { listFriends && !listFriends.length &&
                    <h4 className={styles.nothing + " text-center"}>
                        Aucun ami
                    </h4>
                }
            </div>
        );
    }
}

export default Notifications;
