import React, {Component} from 'react';

import cfg from '../../config';
import styles from './FrontWelcome.scss';


class FrontWelcome extends Component {

    render() {
        return (
            <div className={styles.frontWelcome + " col-xs-6"}>
                <h2>{cfg.signupTitle}</h2>
                <h3><i className="fa fa-star"/> Match</h3>
                <p>{cfg.signupMatch}</p>
                <h3><i className="fa fa-calendar-check-o"/> Meet</h3>
                <p>{cfg.signupMeet}</p>
                <h3><i className="fa fa-share-alt"/> Share</h3>
                <p>{cfg.signupShare}</p>
            </div>
        );
    }
}

export default FrontWelcome;
