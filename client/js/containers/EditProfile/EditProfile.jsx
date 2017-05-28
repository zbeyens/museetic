import React, {Component} from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import Paper from 'material-ui/Paper';

import { editUser } from '../../actions/userActions';
import inputField from '../../components/RenderField/input';
import textArea from '../../components/RenderField/textArea';
import FileInput from '../../components/RenderField/FileInput';
import userValidation from './userValidation';
import cfg from '../../../../shared/config';
import styles from './EditProfile.scss';


@reduxForm({
    form: 'art',
    validate: userValidation,
})
@connect(
    state => ({
        user: state.auth.user,
    }),
    dispatch => bindActionCreators({
        editUser,
    }, dispatch)
)
class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        if (!this.props.new) {
            //NOTE: better to fetch userProfile
            this.props.initialize(this.props.user);
        }
    }

    onSubmit(values) {
        this.props.editUser(values);
    }

    render() {
        const { handleSubmit, submitting } = this.props;

        return (
            <Paper className={"col-xs-6 col-xs-offset-3 padding-15 " + styles.formLogin}>
                {this.props.children}

                <form onSubmit={handleSubmit(this.onSubmit)}>
                    <div className="form-group">
                        <label>Photo</label>
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
                        name="name"
                        type="text"
                        label="Nom*"
                        maxLength={cfg.nameUserLength}
                    />
                    <div>
                        <label>Sexe</label>
                            <Field
                                component={inputField}
                                name="gender"
                                type="radio"
                                label="M"
                                value="Homme"
                            />
                            <Field
                                component={inputField}
                                name="gender"
                                type="radio"
                                label="F"
                                value="Femme"
                            />
                    </div>
                    <Field
                        component={textArea}
                        className="form-control"
                        name="bio"
                        type="text"
                        label="Biographie"
                        maxLength={cfg.bioUserLength}
                    />
                    <Field
                        component={inputField}
                        className="form-control"
                        name="location"
                        type="text"
                        label="Localisation"
                        rows="6"
                        maxLength={cfg.locationUserLength}
                    />

                    <Field
                        component={inputField}
                        className="form-control"
                        name="profession"
                        type="text"
                        label="Profession"
                        rows="6"
                        maxLength={cfg.professionUserLength}
                    />



                    <button type="submit"
                        className="btn btn-info dropdown-button"
                        disabled={submitting}>
                        Enregistrer
                    </button>

                </form>
            </Paper>

        );
    }

}

export default EditProfile;
