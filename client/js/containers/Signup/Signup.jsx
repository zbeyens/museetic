import React from 'react';
import {FrontH, FormSignup} from '../../components';

const Signup = function() {
	return (
		<div>
			<FrontH styleName="signupFrontH" title="Inscription">
				<FormSignup/>
			</FrontH>
		</div>
	);
};

export default Signup;
