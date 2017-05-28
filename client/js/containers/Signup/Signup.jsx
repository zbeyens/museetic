import React from 'react';
import {FormSignup} from '../../components';

const Signup = function() {
	return (
        <div className={"col-xs-4 col-xs-offset-4 "}>
            <h1 className="text-center">Inscription</h1>
            <FormSignup/>
        </div>
	);
};

export default Signup;
