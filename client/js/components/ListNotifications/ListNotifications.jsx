import React, {Component} from 'react';
// import List from 'material-ui/List/List';
// import ListItem from 'material-ui/List/ListItem';
// import Avatar from 'material-ui/Avatar';
// import { Link } from 'react-router';
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
class ListNotifications extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const route = this.props.routing.locationBeforeTransitions.pathname;
        return (
            <li className={route === "/mycollection" && "active"}>
                <Link to="mycollection">
                    <i className="fa fa-star fa-lg" /> Ma collection
                </Link>
            </li>
        );
    }

}

export default ListNotifications;
