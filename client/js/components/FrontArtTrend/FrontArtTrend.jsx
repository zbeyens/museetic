import React, {Component} from 'react';
// import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';

import {

    HTitle,
} from '../';
import { fetchArtTrend, openDialog } from '../../actions/artActions';
import styles from './FrontArtTrend.scss';

@connect(
    state => ({
        currentArt: state.art.currentArt,
    }),
    dispatch => bindActionCreators({
        fetchArtTrend,
        openDialog,
    }, dispatch)
)
class FrontArtTrend extends Component {
    constructor(props) {
        super(props);
        this.handleOpen = this.handleOpen.bind(this);
    }

    componentDidMount() {
        this.props.fetchArtTrend();
    }

    handleOpen(art) {
        browserHistory.push('/art/' + art._id);
        this.props.openDialog(art);
    }

    render() {
        const { currentArt, children } = this.props;

        return (
            <Paper className={styles.frontArtTrend} zDepth={1}>
                {currentArt &&
                    <div>
                        <HTitle title={currentArt.title} />
                        <h4>{currentArt.author}</h4>

                        <a href="javascript:" onClick={() => this.handleOpen(currentArt)}>
                            <div className={styles.imgContainer}>
                                <img className={styles.imgCenter} src={currentArt.picture} alt="" />
                            </div>
                        </a>

                        {children}
                    </div>
                }
            </Paper>

        );
    }
}

export default FrontArtTrend;
