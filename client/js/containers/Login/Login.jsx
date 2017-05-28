import React, {Component} from 'react';
import {
    FormLogin,
    // DividerText,
} from '../../components';

class Login extends Component {

    render() {
        return (
            <div className={"col-xs-4 col-xs-offset-4"}>
                <h1 className="text-center">Connexion</h1>
                <FormLogin />
            </div>
        );
    }
}

export default Login;
