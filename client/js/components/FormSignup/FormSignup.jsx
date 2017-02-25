import React, {Component} from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { signup } from '../../actions/authActions';
import renderField from '../renderField';
import signupValidation from './signupValidations';
import styles from './FormSignup.scss';

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
                        component={renderField}
                        className="form-control"
                        name="name"
                        type="text"
                        placeholder="Nom"
                        size="30"/>
                    <Field
                        component={renderField}
                        className="form-control"
                        name="email"
                        type="text"
                        placeholder="Adresse e-mail"
                        errorAsync={signupError && signupError.email}
                        size="30"/>
                    <Field
                        component={renderField}
                        className="form-control"
                        name="password"
                        type="password"
                        placeholder="Mot de passe"
                        size="30"/>

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
