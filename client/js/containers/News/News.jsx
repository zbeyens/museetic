import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
// import Avatar from 'material-ui/Avatar';
// import Paper from 'material-ui/Paper';

import {
} from '../../components';
import cfg from '../../config';
import styles from './News.scss';

@connect(
    state => ({
        user: state.auth.user,
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)
class News extends Component {
    //     <Link to={'/art/' + artProfile._id}>
    //     <div className={styles.imgContainer}>
    //         <img className={styles.imgCenter} src={artProfile.picture} alt="" />
    //     </div>
    // </Link>
    render() {
        return (
            <div className="text-center">
                <h1>Bonjour {this.props.user.name}!</h1>
                <div className={styles.belowTitle}>
                    <div className={styles.credits}>
                        {cfg.credits}
                    </div>
                    <div>
                        <span>{cfg.newsDesc}</span>
                        <Link to="/">par ici.</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default News;
