import React from 'react';
import styles from './HTitle.scss';

const HTitle = function(props) {
    return (
        <h3 className={styles.title}><span>{props.title}</span></h3>
    );
};

export default HTitle;
