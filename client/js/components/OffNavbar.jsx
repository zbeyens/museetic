import React, {Component} from 'react';
import Navbar from './Navbar.jsx';
// import ProfileButton from './ProfileButton.jsx';
import OffDropdownLi from './OffDropdownLi.jsx';

class OutNavbar extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        // var items = [
        //     <ProfileButton buttonText=" Ziyad"/>,
        // ];
        // var listItems = items.map((item, i) =>
        //     <li key={i}>
        //         {item}
        //     </li>
        // );
        // {listItems}

        return (

            <Navbar>
                <OffDropdownLi onLoginSubmit={this.props.onLoginSubmit}/>
            </Navbar>

        );
    }
}

export default OutNavbar;
