import React, {Component} from 'react';
// import List from 'material-ui/List/List';
// import ListItem from 'material-ui/List/ListItem';
// import Avatar from 'material-ui/Avatar';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

@connect(
    () => ({}),
    dispatch => bindActionCreators({
    }, dispatch)
)
class LiEditProfile extends Component {

    render() {
        return (
            <li><Link to="/editProfile">Gérer mon profil</Link></li>
        );
    }

}

export default LiEditProfile;
