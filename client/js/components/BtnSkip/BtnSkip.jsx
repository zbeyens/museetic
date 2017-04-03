import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { skipArt } from '../../actions/artActions';

@connect(
    state => ({}),
    dispatch => bindActionCreators({
        skipArt
    }, dispatch)
)
class BtnSkip extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        this.props.skipArt();
    }

    render() {
        return (
            <button className="btn btn-info btn-circle btn-lg dropdown-button"
                onClick={this.handleSubmit}>
                <i className="fa fa-refresh"/>
            </button>
        );
    }
}

export default BtnSkip;
