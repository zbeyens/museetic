import React, {Component} from 'react';

class LiDropdown extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                    {this.props.a}
                    <span className="caret"></span>
                </a>
                <ul className="dropdown-menu">
                    {this.props.children}
                </ul>
            </li>
        );
    }

}

export default LiDropdown;
