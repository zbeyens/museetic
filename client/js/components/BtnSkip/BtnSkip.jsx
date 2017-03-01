import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchArtTrend } from '../../actions/artActions';

@connect(
    state => ({}),
    dispatch => bindActionCreators({
        fetchArtTrend
    }, dispatch)
)
class BtnSkip extends Component {
    constructor(props) {
        super(props);
        this.onSkip = this.onSkip.bind(this);
    }

    onSkip() {
        this.props.fetchArtTrend();
    }

    render() {
        return (
            <button className="btn btn-info btn-circle btn-lg dropdown-button"
                onClick={this.onSkip}>
                <i className="fa fa-refresh"/>
            </button>
        );
    }
}

export default BtnSkip;
