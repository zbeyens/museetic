import React, {Component} from 'react';
// import TextField from 'material-ui/TextField';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import GoogleButton from '../GoogleButton';
import FacebookButton from '../FacebookButton';
import { login } from '../../actions/authActions';
import inputField from '../RenderField/input';
import loginValidation from './loginValidation';
import styles from './FormLogin.scss';


@reduxForm({
    form: 'login',
    validate: loginValidation,
})
@connect(
    state => ({
        loginError: state.auth.loginError,
    }),
    dispatch => bindActionCreators({
        login
    }, dispatch)
)
class FormLogin extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(values) {
        this.props.login(values);
    }

    render() {
        const { handleSubmit, submitting, pristine, loginError } = this.props;

        return (
            <div className={styles.formLogin}>
                <FacebookButton divClass="socialDiv" buttonText="Se connecter avec Facebook"/>
                <GoogleButton divClass="socialDiv" buttonText="Se connecter avec Google"/>
                {this.props.children}
                <form onSubmit={handleSubmit(this.onSubmit)}>
                    <Field
                        component={inputField}
                        className="form-control"
                        name="email"
                        type="text"
                        placeholder="Adresse e-mail"
                        errorAsync={loginError && loginError.email}
                        size="30"
                    />
                    <Field
                        component={inputField}
                        className="form-control"
                        name="password"
                        type="password"
                        placeholder="Mot de passe"
                        errorAsync={loginError && loginError.password}
                        size="30"
                    />

                    { pristine &&
                        <Link to="/login">
                            <button type="submit"
                                className="btn btn-info dropdown-button"
                                disabled={submitting}>
                                Se connecter
                            </button>
                        </Link>
                    }
                    { !pristine &&
                        <button type="submit"
                            className="btn btn-info dropdown-button"
                            disabled={submitting}>
                            Se connecter
                        </button>
                    }

                </form>
            </div>

        );
    }

}

export default FormLogin;
