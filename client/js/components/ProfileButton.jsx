import React from 'react';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';
import { Link } from 'react-router';

class ProfileButton extends React.Component {
    //oRnhywks5PZ4_9NHqlVd-h9F
    constructor(props, context) {
        super(props, context);
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
        return (
            <Link to="/">
                <button className="btn navbar-btn pic" onClick={this.props.onLogout}>
                    <img
                        src="https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/13729036_10210364491130439_6817853708507415078_n.jpg?oh=b13eeb5c58dea5499352596c7cc9bf67&oe=58C3A542"
                        width="30" />
                    {this.props.buttonText}
                </button>
            </Link>
        );
    }

}

export default ProfileButton;
