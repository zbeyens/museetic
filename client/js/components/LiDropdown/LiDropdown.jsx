import React, {Component} from 'react';
import styles from './LiDropdown.scss';

//navbar right component
class LiDropdown extends Component {
    render() {
        return (
            <ul className={"nav navbar-nav navbar-right " + styles.dd}>
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                        {this.props.a}
                        <span className="caret"/>
                    </a>
                    <ul className="dropdown-menu">
                        {this.props.children}
                    </ul>
                </li>
            </ul>
        );
    }

}

export default LiDropdown;
