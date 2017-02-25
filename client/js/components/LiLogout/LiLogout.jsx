import React, {Component} from 'react';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { logout } from '../../actions/authActions';

@connect(
    () => ({}),
    dispatch => bindActionCreators({
        logout
    }, dispatch)
)
class LiLogout extends React.Component {

    constructor(props) {
        super(props);
        this.onLogout = this.onLogout.bind(this);
    }

    onLogout() {
        this.props.logout();
    }

    render() {
        // {this.props.buttonText}
        // <List>
        //     <ListItem
        //         href="/profile"
        //         primaryText="Brendan Lim"
        //         size={10}
        //         leftAvatar={
        //             <Avatar size={40} src="client/img/cafe.png" />
        //         }>
        //     </ListItem>
        // </List>
        // <Link to="/">
        // </Link>
        return (
            <li><a href="#" onClick={this.onLogout}>Se déconnecter</a></li>
        );
    }

}

export default LiLogout;
