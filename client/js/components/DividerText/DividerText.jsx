import React from 'react';
import styles from './DividerText.scss';

const DividerText = function(props) {
    return (
        <div className={styles[props.styleName]}>
            <hr/>
            <span>
                {props.text}
            </span>
        </div>
    );
};

export default DividerText;
