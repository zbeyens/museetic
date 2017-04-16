import React, {Component} from 'react';
import {
    FrontH,
    FormLogin,
    DividerText,
} from '../../components';


class Login extends Component {

    render() {
        return (
            <div>
                <FrontH
                    styleName="loginFrontH"
                    title="Connexion">
                    <FormLogin>
                        <DividerText styleName="dividerTextFront" text="or"/>
                    </FormLogin>
                </FrontH>
            </div>
        );
    }
}

export default Login;
