import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { likeArt } from '../../actions/artActions';

@connect(
    state => ({
        user: state.auth.user,
    }),
    dispatch => bindActionCreators({}, dispatch)
)
class BtnLikeArt extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        this.props.likeArt(this.props.art._id);
    }

    render() {
        const { art, user } = this.props;
        const likes = art.likes;

        if (likes && likes.indexOf(user._id) !== -1) {
            return (
                <button className="btn btn-primary btn-circle btn-lg dropdown-button"
                    onClick={this.handleSubmit}>
                    <i className="fa fa-heart"/>
                </button>
            );
        }
        return (
            <button className="btn btn-circle btn-lg dropdown-button"
                onClick={this.handleSubmit}>
                <i className="fa fa-heart"/>
            </button>
        );
    }
}

export default BtnLikeArt;
