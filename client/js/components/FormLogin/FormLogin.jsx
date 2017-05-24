import React, {Component} from 'react';
// import TextField from 'material-ui/TextField';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

// import GoogleButton from '../GoogleButton';
// import FacebookButton from '../FacebookButton';
import Subheader from 'material-ui/Subheader';
import { login } from '../../actions/authActions';
import inputField from '../RenderField/input';
import loginValidation from './loginValidation';
import cfg from '../../../../shared/config';
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
        // <FacebookButton divClass="socialDiv" buttonText="Se connecter avec Facebook"/>
        // <GoogleButton divClass="socialDiv" buttonText="Se connecter avec Google"/>
        // {this.props.children}
        return (
            <div className={"padding-15 " + styles.formLogin}>
                {this.props.children}

                <form onSubmit={handleSubmit(this.onSubmit)}>
                    <Field
                        component={inputField}
                        className="form-control"
                        name="email"
                        type="text"
                        placeholder="Adresse e-mail"
                        errorAsync={loginError && loginError.email}
                        maxLength={cfg.formEmailLength}
                    />
                    <Field
                        component={inputField}
                        className="form-control"
                        name="password"
                        type="password"
                        placeholder="Mot de passe"
                        errorAsync={loginError && loginError.password}
                        maxLength={cfg.formPasswordLength}
                    />

                    { pristine &&
                        <Link to="/login">
                        <button type="submit"
                            className="btn btn-info dropdown-button margin-t10"
                            disabled={submitting}>
                            Se connecter
                        </button>
                    </Link>
                }
                { !pristine &&
                    <button type="submit"
                        className="btn btn-info dropdown-button margin-t10"
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
