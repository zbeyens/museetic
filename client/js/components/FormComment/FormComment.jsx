import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { sendComment, jumpComment } from '../../actions/artActions';
import textAreaField from '../RenderField/textArea';
import cfg from './../../../../shared/config';
import styles from './FormComment.scss';


@reduxForm({
    form: 'comment',
})
@connect(
    state => ({
        jump: state.art.jump,
    }),
    dispatch => bindActionCreators({
        sendComment,
        jumpComment
    }, dispatch)
)
class FormComment extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount() {
        //hack... DOM is not completly rendered directly
        if (this.props.jump) {
            const loop = setInterval(() => {
                const areaCom = document.getElementById("areaCom");
                if (areaCom) {
                    areaCom.focus();
                    areaCom.scrollIntoView(true);
                    this.props.jumpComment(false);
                    clearInterval(loop);
                }
            }, 1);
        }
    }

    onSubmit(values) {
        if (values.com) {
            this.props.reset();
            this.props.sendComment(this.props.art._id, values.com);
        }
    }

    handleKeyDown(e, cb) {
        if (e.key === 'Enter' && e.shiftKey === false) {
            e.preventDefault();
            cb();
            this.props.reset();
        }
    }

    render() {
        const { handleSubmit } = this.props;
        return (
            <form onSubmit={handleSubmit(this.onSubmit)}
                onKeyDown={(e) => { this.handleKeyDown(e, handleSubmit(this.onSubmit)); }}>
                <div className={styles.comWrite}>

                    <div className={"col-xs-10 " + styles.comAreaContainer}>
                        <Field className={styles.comArea}
                            component={textAreaField}
                            id="areaCom"
                            name="com"
                            maxLength={cfg.formCommentLength}
                            rows={cfg.formCommentRow}
                            placeholder={"Commenter..."}
                        />
                    </div>
                    <button className={"btn btn-blue margin-b10 margin-l5 " + styles.comBtn}>
                        Envoyer
                    </button>

                </div>
            </form>

        );
    }

}

export default FormComment;
