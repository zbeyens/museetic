import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';

import { loadAuth } from '../../actions/authActions';
import { fetchUserProfile, addFriend, addModerator, removeFriend, removeModerator } from '../../actions/userActions';
import { setDestMessage, setChatOpen } from '../../actions/chatActions';

import {
    BtnFriendContainer,
    GridListArt,
} from '../../components';
import styles from './UserProfile.scss';

import cfgClient from '../../config/configClient';

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
        addModerator,
        removeFriend,
        removeModerator,
        setDestMessage,
        setChatOpen,
    }, dispatch)
)
class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.onAddFriend = this.onAddFriend.bind(this);
        this.onAddModerator = this.onAddModerator.bind(this);
        this.onRemoveFriend = this.onRemoveFriend.bind(this);
        this.onRemoveModerator = this.onRemoveModerator.bind(this);
        this.onClickContact = this.onClickContact.bind(this);
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

    onAddModerator() {
        this.props.addModerator(this.props.userProfile._id, this);
    }

    onRemoveFriend() {
        this.props.removeFriend(this.props.userProfile._id, this);
    }

    onRemoveModerator() {
        this.props.removeModerator(this.props.userProfile._id, this);
    }

    onClickContact() {
        this.props.setChatOpen(true);
        this.props.setDestMessage(this.props.userProfile);
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
                                    src={userProfile.picture}
                                    size={175}
                                />
                            </div>
                            <h3>{userProfile.name}</h3>
                            {
                                userProfile.role === 'admin' &&
                                <h4>
                                    <span className="label label-primary role">{cfgClient.admin}</span>
                                </h4>
                            }
                            {
                                userProfile.role === 'moderator' &&
                                <h4>
                                    <span className="label label-danger role">{cfgClient.moderator}</span>
                                </h4>
                            }
                            {!userProfile.role &&
                                <h4>
                                    <span className="label label-success role">{cfgClient.member}</span>
                                </h4>
                            }
                            {
                                user.role === 'admin' && !userProfile.role &&
                                <button className="btn btn-danger" onClick={this.onAddModerator}>
                                    <i className="fa fa-plus-circle"/> {cfgClient.addModerator}
                                </button>
                            }
                            {
                                user.role === 'admin' && userProfile.role === 'moderator' &&
                                <button className="btn btn-danger" onClick={this.onRemoveModerator}>
                                    <i className="fa fa-minus-circle"/> {cfgClient.removeModerator}
                                </button>
                            }
                            {!isFriend && !friendRequested && !isMyProfile && !friendResponse &&
                                <button className="btn btn-default margin-t5" onClick={this.onAddFriend}>
                                    <i className="fa fa-user-plus"/> {cfgClient.addFriend}
                                </button>
                            }
                            {!isFriend && friendRequested === true && !isMyProfile && !friendResponse &&
                                <button className="btn btn-default margin-t5" onClick={this.onAddFriend}>
                                    <i className="fa fa-user-plus"/> {cfgClient.addedFriend}
                                </button>
                            }
                            {!isFriend && !isMyProfile && friendResponse &&
                                <BtnFriendContainer friend={userProfile}/>
                            }
                            {isFriend &&
                                <button className="btn btn-default margin-t5" onClick={this.onRemoveFriend}>
                                    <i className="fa fa-user-times"/> {cfgClient.removeFriend}
                                </button>
                            }
                            {!isMyProfile &&
                                <div>
                                    <button className="btn btn-info margin-t5 margin-b5" onClick={this.onClickContact}>
                                        <i className="fa fa-comment"/> {cfgClient.contact}
                                    </button>
                                </div>
                            }
                            { userProfile.location &&
                                <div>
                                    <strong>Localisation: </strong>
                                    <div>{userProfile.location}</div>
                                </div>
                            }
                            { userProfile.bio &&
                                <div>
                                    <strong>Biographie: </strong>
                                    <div>{userProfile.bio}</div>
                                </div>
                            }
                            { userProfile.gender &&
                                <div>
                                    <strong>Sexe: </strong>
                                    <div>{userProfile.gender}</div>
                                </div>
                            }
                            { userProfile.profession &&
                                <div>
                                    <strong>Profession: </strong>
                                    <div>{userProfile.profession}</div>
                                </div>
                            }

                        </Paper>
                        <div className="col-xs-9">
                            <Paper className={"col-xs-12 padding-0"} zDepth={1}>
                                <Tabs>
                                    <Tab label="COLLECTION">
                                        <GridListArt list={listArts}/>
                                    </Tab>
                                </Tabs>
                            </Paper>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default UserProfile;
