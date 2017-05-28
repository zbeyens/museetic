import React, {Component} from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';


import { addMuseum, editMuseum } from '../../actions/museumActions';
import inputField from '../RenderField/input';
import textArea from '../RenderField/textArea';
import FileInput from '../RenderField/FileInput';
import museumValidation from './museumValidation';
import cfg from '../../../../shared/config';
import styles from './FormMuseum.scss';


@reduxForm({
    form: 'museum',
    validate: museumValidation,
})
@connect(
    state => ({
        museumProfile: state.museum.museumProfile,
    }),
    dispatch => bindActionCreators({
        addMuseum,
        editMuseum
    }, dispatch)
)
class FormMuseum extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        if (!this.props.new) {
            this.props.initialize(this.props.museumProfile);
        }
    }

    onSubmit(values) {
        if (this.props.new) {
            this.props.addMuseum(values);
        } else {
            this.props.editMuseum(this.props.museumProfile._id, values);
        }
    }

    //TODO: not same name!
    render() {
        const { handleSubmit, submitting, loginError } = this.props;

        return (
            <div className={"padding-15 " + styles.formLogin}>
                {this.props.children}

                <form onSubmit={handleSubmit(this.onSubmit)}>
                    <Field
                        component={inputField}
                        className="form-control"
                        name="name"
                        type="text"
                        label="Nom*"
                        errorAsync={loginError && loginError.name}
                        maxLength={cfg.nameMuseumLength}
                    />
                    <Field
                        component={inputField}
                        className="form-control"
                        name="address"
                        type="text"
                        label="Adresse*"
                        maxLength={cfg.addressMuseumLength}
                    />
                    <Field
                        component={textArea}
                        className="form-control"
                        name="desc"
                        type="text"
                        label="Présentation*"
                        rows="6"
                        maxLength={cfg.descMuseumLength}
                    />

                    <div className="form-group">
                        <label>Image</label>
                        <Field
                            component={FileInput}
                            type="file"
                            name="picture"
                        />
                        <p className="help-block">Maximum 5MB</p>
                    </div>

                    <Field
                        component={inputField}
                        className="form-control"
                        name="url"
                        type="text"
                        label="Site web"
                        maxLength={cfg.urlMuseumLength}
                    />
                    <Field
                        component={inputField}
                        className="form-control"
                        name="tel"
                        type="text"
                        label="Téléphone"
                        maxLength={cfg.telMuseumLength}
                    />
                    <Field
                        component={inputField}
                        className="form-control"
                        name="fax"
                        type="text"
                        label="Fax"
                        maxLength={cfg.telMuseumLength}
                    />
                    <Field
                        component={inputField}
                        className="form-control"
                        name="open"
                        type="text"
                        label="Ouverture"
                        maxLength={cfg.openMuseumLength}
                    />
                    <Field
                        component={inputField}
                        className="form-control"
                        name="close"
                        type="text"
                        label="Fermeture"
                        maxLength={cfg.closeMuseumLength}
                    />
                    <Field
                        component={inputField}
                        className="form-control"
                        name="tarif"
                        type="text"
                        label="Tarif"
                        maxLength={cfg.tarifMuseumLength}
                    />

                    <button type="submit"
                        className="btn btn-info dropdown-button"
                        disabled={submitting}>
                        Enregistrer
                    </button>

                </form>
            </div>

        );
    }

}

export default FormMuseum;
