import React from 'react';
import styles from './BtnContainer.scss';

const BtnContainer = function(props) {
    return (
        <div className={styles.btnContainer}>
            {props.children}
        </div>
    );
};

export default BtnContainer;
