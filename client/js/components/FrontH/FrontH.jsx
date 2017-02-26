import React from 'react';
import styles from './FrontH.scss';

const FrontH = function(props) {
	return (
		<div className={styles[props.styleClass]}>
			<h1>{props.title}</h1>

			{props.children}
		</div>
	);
};

export default FrontH;
