import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { sendComment, jumpComment } from '../../actions/artActions';
import textAreaField from '../RenderField/textArea';
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
    }

    componentDidMount() {
        //hack... DOM is not completly rendered directly
        if (this.props.jump) {
            const loop = setInterval(() => {
                const com = document.getElementById("com");
                if (com) {
                    com.focus();
                    com.scrollIntoView(true);
                    this.props.jumpComment(false);
                    clearInterval(loop);
                }
            }, 1);
        }
    }

    onSubmit(values) {
        this.props.sendComment(this.props.art._id, values.com);
    }

    render() {
        const { handleSubmit } = this.props;
        return (
            <form onSubmit={handleSubmit(this.onSubmit)}>
                <div className={styles.comWrite}>

                    <div className={styles.comAreaContainer}>
                        <Field className={styles.comArea}
                            component={textAreaField}
                            id="com"
                            name="com"
                            maxLength={15}
                            rows={3}
                            placeholder={"Commenter..."}
                        />
                    </div>

                    <button className={"btn btn-success " + styles.comSend}>
                        <i className="fa fa-send"/>
                    </button>
                </div>
            </form>

        );
    }

}

export default FormComment;
