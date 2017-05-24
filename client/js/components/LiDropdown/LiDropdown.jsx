import React, {Component} from 'react';
// import styles from './LiDropdown.scss';

//navbar right component
class LiDropdown extends Component {
    render() {
        return (
            <li className="dropdown">
                <a href="javascript:" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                    {this.props.children}
                </a>
                <ul className="dropdown-menu">
                    {this.props.inside}
                </ul>
            </li>
        );
    }

}

export default LiDropdown;
