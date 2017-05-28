import React, {Component} from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';


import { addArt, editArt, fetchArt } from '../../actions/artActions';
import inputField from '../RenderField/input';
import textArea from '../RenderField/textArea';
import FileInput from '../RenderField/FileInput';
import artValidation from './artValidation';
import cfg from '../../../../shared/config';
import styles from './FormArt.scss';


@reduxForm({
    form: 'art',
    validate: artValidation,
})
@connect(
    state => ({
        museumProfile: state.museum.museumProfile,
        artProfile: state.art.artProfile,
    }),
    dispatch => bindActionCreators({
        addArt,
        editArt,
        fetchArt,
    }, dispatch)
)
class FormArt extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        if (!this.props.new) {
            this.props.initialize(this.props.artProfile);
        }
    }

    onSubmit(values) {
        if (this.props.new) {
            values.museum = this.props.museumProfile._id;
            this.props.addArt(values);
        } else {
            values.id = this.props.artProfile._id;
            this.props.editArt(values, this);
        }
    }

    render() {
        const { handleSubmit, submitting } = this.props;

        return (
            <div className={"padding-15 " + styles.formLogin}>
                {this.props.children}

                <form onSubmit={handleSubmit(this.onSubmit)}>
                    <div className="form-group">
                        <label>Image*</label>
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
                        name="title"
                        type="text"
                        label="Titre*"
                        maxLength={cfg.titleArtLength}
                    />
                    <Field
                        component={inputField}
                        className="form-control"
                        name="subtitle"
                        type="text"
                        label="Sous-titre"
                        maxLength={cfg.subtitleArtLength}
                    />
                    <Field
                        component={textArea}
                        className="form-control"
                        name="abstract"
                        type="text"
                        label="Abstract"
                        rows="6"
                        maxLength={cfg.abstractArtLength}
                    />

                    <Field
                        component={textArea}
                        className="form-control"
                        name="desc"
                        type="text"
                        label="Description"
                        rows="6"
                        maxLength={cfg.descArtLength}
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

export default FormArt;
