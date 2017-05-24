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
        currentArt: state.art.currentArt,
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
        const { currentArt, children } = this.props;

        return (
            <Paper className={"thumbnail col-xs-8 col-xs-offset-2 padding-b20 " + styles.frontArtTrend} zDepth={1}>
                {currentArt &&
                    <div>
                        <HTitle title={currentArt.title} />
                        <h4>{currentArt.author}</h4>

                        <Link to={'/art/' + currentArt._id}>
                            <div className={styles.imgContainer}>
                                <img className={styles.imgCenter} src={currentArt.picture} alt="" />
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
