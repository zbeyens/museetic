import React, {Component} from 'react';
import Navbar from './Navbar.jsx';
import ProfileButton from './ProfileButton.jsx';
// import OffDropdownLi from './OffDropdownLi.jsx';

class OnNavbar extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (

            <Navbar>
                <ProfileButton buttonText=" Ziyad" onLogout={this.props.onLogout}/>
            </Navbar>

        );
    }
}

export default OnNavbar;
