import React, {Component} from 'react';
import {
    FrontH,
    FormLogin
} from '../../components';
// import styles from './Login.scss';


class Login extends Component {

    render() {
        return (
            <div>
                <FrontH
                    style="loginFrontH"
                    title="Connexion">
                    <FormLogin />
                </FrontH>
            </div>
        );
    }
}

export default Login;
