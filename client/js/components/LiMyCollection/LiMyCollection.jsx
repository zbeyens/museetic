import React, {Component} from 'react';
// import List from 'material-ui/List/List';
// import ListItem from 'material-ui/List/ListItem';
// import Avatar from 'material-ui/Avatar';
// import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

@connect(
    state => ({
        routing: state.routing,
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)
class LiMyCollection extends Component {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        browserHistory.push('/mycollection');
    }

    render() {
        const route = this.props.routing.locationBeforeTransitions.pathname;
        return (
            <li className={route === "/mycollection" && "active"}>
                <a href="javascript:" onClick={this.onClick}>
                    <i className="fa fa-star fa-lg" /> Ma collection
                </a>
            </li>
        );
    }

}

export default LiMyCollection;
