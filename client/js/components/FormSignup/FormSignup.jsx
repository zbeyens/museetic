import React, {Component} from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { signup } from '../../actions/authActions';
import inputField from '../RenderField/input';
import signupValidation from './signupValidations';
import styles from './FormSignup.scss';
import cfg from '../../../../shared/config';

@reduxForm({
    form: 'signup',
    validate: signupValidation,
})
@connect(
    state => ({
        signupError: state.auth.signupError,
    }),
    dispatch => bindActionCreators({
        signup
    }, dispatch)
)
class FormSignup extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    //called only if no error
    onSubmit(values) {
        this.props.signup(values);
    }

    render() {
        const { handleSubmit, submitting, pristine, signupError } = this.props;

        return (
            <div className={styles.formSignup}>
                <form onSubmit={handleSubmit(this.onSubmit)}>
                    <Field
                        component={inputField}
                        className={" form-control"}
                        name="name"
                        type="text"
                        label="Nom"
                        placeholder="Votre nom"
                        maxLength={cfg.formNameLength}/>
                    <Field
                        component={inputField}
                        className="form-control"
                        name="email"
                        type="text"
                        label="Email"
                        placeholder="Votre adresse email"
                        errorAsync={signupError && signupError.email}
                        maxLength={cfg.formEmailLength}/>
                    <Field
                        component={inputField}
                        className="form-control"
                        name="password"
                        type="password"
                        label="Mot de passe"
                        placeholder="Créez un mot de passe"
                        maxLength={cfg.formPasswordLength}/>

                    { pristine &&
                        <Link to="/signup">
                            <button type="submit"
                                className="btn btn-success btn-lg"
                                disabled={submitting}>
                                S'inscrire
                            </button>
                        </Link>
                    }
                    { !pristine &&
                        <button type="submit"
                            className="btn btn-success btn-lg"
                            disabled={submitting}>
                            S'inscrire
                        </button>
                    }

                </form>

            </div>
        );
    }
}

export default FormSignup;
