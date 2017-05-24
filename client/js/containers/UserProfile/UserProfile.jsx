import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';

import { loadAuth } from '../../actions/authActions';
import { fetchUserProfile, addFriend, removeFriend } from '../../actions/userActions';
import {
    BtnFriendContainer,
    GridListArt,
} from '../../components';
import styles from './UserProfile.scss';

@connect(
    state => ({
        user: state.auth.user,
        listNotif: state.user.listNotif,
        userProfile: state.user.userProfile,
        listArts: state.art.listArts,
    }),
    dispatch => bindActionCreators({
        loadAuth,
        fetchUserProfile,
        addFriend,
        removeFriend,
    }, dispatch)
)
class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.onAddFriend = this.onAddFriend.bind(this);
        this.onRemoveFriend = this.onRemoveFriend.bind(this);
    }

    componentDidMount() {
        this.props.fetchUserProfile(1, this.props.params.id);
        this.param = this.props.params.id;
    }

    componentDidUpdate() {
        if (this.param !== this.props.params.id) {
            this.props.fetchUserProfile(0, this.props.params.id);
            this.param = this.props.params.id;
        }
    }

    onAddFriend() {
        this.props.addFriend(this.props.userProfile._id, this);
    }

    onRemoveFriend() {
        this.props.removeFriend(this.props.userProfile._id, this);
    }

    render() {
        const { listNotif, listArts, userProfile, user } = this.props;
        let isMyProfile = false;
        let friendRequested = false;
        let isFriend = false;
        let friendResponse = false; //should i accept or decline invitation

        if (userProfile) {
            if (userProfile._id === user._id) {
                isMyProfile = true;
            }

            for (let i = 0; i < user.friends.length; i++) {
                if (user.friends[i] === userProfile._id) {
                    isFriend = true;
                    break;
                }
            }

            for (let i = 0; i < userProfile.friendRequests.length; i++) {
                if (userProfile.friendRequests[i] === user._id) {
                    friendRequested = true;
                    break;
                }
            }

            if (listNotif) {
                for (let i = 0; i < listNotif.length; i++) {
                    if (listNotif[i]._id === userProfile._id) {
                        friendResponse = true;
                        break;
                    }
                }
            }
        }


        return (
            <div>
                {userProfile && listArts &&
                    <div className="row">
                        <Paper className={"col-xs-3 " + styles.leftContainer} zDepth={1}>
                            <div className={styles.picContainer}>
                                <Avatar
                                    className={styles.pic}
                                    src="client/img/user-image256.png"
                                    size={175}
                                />
                            </div>
                            <h3>{userProfile.name}</h3>
                            {
                                userProfile.role === 'admin' &&
                                <h4>
                                    <span className="label label-primary role">Admin</span>
                                </h4>
                            }
                            {!userProfile.role &&
                                <h4>
                                    <span className="label label-success role">Membre</span>
                                </h4>
                            }
                            {!isFriend && !friendRequested && !isMyProfile && !friendResponse &&
                                <button className="btn btn-default" onClick={this.onAddFriend}>
                                    <i className="fa fa-user-plus"/> Ajouter en ami
                                </button>
                            }
                            {!isFriend && friendRequested === true && !isMyProfile && !friendResponse &&
                                <button className="btn btn-default" onClick={this.onAddFriend}>
                                    <i className="fa fa-user-plus"/> Invitation envoyée
                                </button>
                            }
                            {!isFriend && !isMyProfile && friendResponse &&
                                <BtnFriendContainer friend={userProfile}/>
                            }
                            {isFriend &&
                                <button className="btn btn-default" onClick={this.onRemoveFriend}>
                                    <i className="fa fa-user-times"/> Retirer des amis
                                </button>
                            }

                        </Paper>
                        <div className="col-xs-9">
                            <Paper className={"col-xs-12 " + styles.rightContainer} zDepth={1}>
                                <div>

                                    <ul className="nav nav-tabs" role="tablist">
                                        <li role="presentation" className="active">
                                            <a href="#home" aria-controls="home" role="tab" data-toggle="tab">Collection</a>
                                        </li>
                                    </ul>

                                    <div className="tab-content">
                                        <div role="tabpanel" className="tab-pane fade in active" id="home">
                                            <GridListArt list={listArts}/>
                                        </div>
                                    </div>

                                </div>
                            </Paper>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default UserProfile;
