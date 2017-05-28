import React, {Component} from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';

import {
    HTitle,
} from '../';
import { fetchArtTrend } from '../../actions/artActions';
import styles from './FrontArtTrend.scss';

@connect(
    state => ({
        artProfile: state.art.artProfile,
    }),
    dispatch => bindActionCreators({
        fetchArtTrend,
    }, dispatch)
)
class FrontArtTrend extends Component {
    componentDidMount() {
        this.props.fetchArtTrend();
    }

    render() {
        const { artProfile, children } = this.props;

        return (
            <Paper className={"thumbnail col-xs-8 col-xs-offset-2 padding-b20 " + styles.frontArtTrend} zDepth={1}>
                {artProfile &&
                    <div>
                        <HTitle title={artProfile.title} />
                        <h4>{artProfile.author}</h4>

                        <Link to={'/art/' + artProfile._id}>
                            <div className={styles.imgContainer}>
                                <img className={styles.imgCenter} src={artProfile.picture} alt="" />
                            </div>
                        </Link>

                        {children}
                    </div>
                }
            </Paper>

        );
    }
}

export default FrontArtTrend;
