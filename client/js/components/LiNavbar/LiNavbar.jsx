import React, {Component} from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

@connect(
    state => ({
        routing: state.routing,
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)
class LiNavbar extends Component {
    render() {
        const route = this.props.routing.locationBeforeTransitions.pathname;
        return (
            <li className={route === this.props.route && "active"}>
                <Link to={this.props.route}>
                    {this.props.children}
                </Link>
            </li>
        );
    }

}

export default LiNavbar;
