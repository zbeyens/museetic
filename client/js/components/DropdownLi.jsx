import React, {Component} from 'react';
import DropdownA from './DropdownA.jsx';

class DropdownLi extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li className="dropdown">
                <DropdownA text={this.props.text} />
                {this.props.children}
            </li>
        );
    }

}

export default DropdownLi;
