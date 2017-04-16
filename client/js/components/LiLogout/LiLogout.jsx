import React, {Component} from 'react';
// import List from 'material-ui/List/List';
// import ListItem from 'material-ui/List/ListItem';
// import Avatar from 'material-ui/Avatar';
// import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { logout } from '../../actions/authActions';

@connect(
    () => ({}),
    dispatch => bindActionCreators({
        logout
    }, dispatch)
)
class LiLogout extends Component {

    constructor(props) {
        super(props);
        this.onLogout = this.onLogout.bind(this);
    }

    onLogout() {
        this.props.logout();
    }

    render() {
        return (
            <li><a href="javascript:" onClick={this.onLogout}>Se déconnecter</a></li>
        );
    }

}

export default LiLogout;
