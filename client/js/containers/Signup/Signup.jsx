import React, {Component} from 'react';
import {
    FrontH,
    FormSignup
} from '../../components';
// import styles from './Signup.scss';


class Signup extends Component {

    render() {

        return (
            <div>
                <FrontH
                    style="signupFrontH"
                    title="Inscription">
                    <FormSignup />
                </FrontH>
            </div>
        );
    }
}

export default Signup;
