import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { jumpComment } from '../../actions/artActions';


@connect(
    state => ({
        loginError: state.auth.loginError,
    }),
    dispatch => bindActionCreators({
        jumpComment
    }, dispatch)
)
class BtnComment extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    /**
     * if ArtTrend: go to /art.
     * else: scroll
     */
    onClick() {
        if (this.props.jump) {
            browserHistory.push('/art/' + this.props.art._id);
            this.props.jumpComment(true);
        } else {
            const com = document.getElementById("com");
            com.focus();
            com.scrollIntoView(true);
        }
    }

    render() {
        return (
            <button className="btn btn-info btn-circle btn-lg dropdown-button"
                onClick={this.onClick}>
                <i className="fa fa-comments"/>
            </button>
        );
    }
}

export default BtnComment;
