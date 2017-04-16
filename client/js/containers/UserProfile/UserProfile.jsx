import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';

import { fetchUserProfile } from '../../actions/userActions';
import {
    GridListArt,
} from '../../components';
import styles from './UserProfile.scss';

@connect(
    state => ({
        userProfile: state.user.userProfile,
        listArts: state.art.listArts,
    }),
    dispatch => bindActionCreators({
        fetchUserProfile,
    }, dispatch)
)
class UserProfile extends Component {
    componentDidMount() {
        this.props.fetchUserProfile(this.props.params.id);
    }

    render() {
        const { listArts, userProfile } = this.props;

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
                                <div>Admin</div>
                            }
                            {!userProfile.role &&
                                <div>Membre</div>
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
