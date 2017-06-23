import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { fetchChats, sendChatMessage } from '../../actions/chatActions';
import textAreaField from '../RenderField/textArea';
import cfg from './../../../../shared/config';
import styles from './FormChat.scss';


@reduxForm({
    form: 'chat',
})
@connect(
    state => ({
        destUser: state.chat.destUser,
    }),
    dispatch => bindActionCreators({
        fetchChats,
        sendChatMessage
    }, dispatch)
)
class FormChat extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount() {
        //can fetch msg regularly
    }

    onSubmit(values) {
        if (values.com) {
            this.props.reset();
            this.props.sendChatMessage(this, this.props.destUser._id, values.com);
            setTimeout(() => {
                const list = document.getElementById("listChatComment");
                if (list) {
                    list.scrollTop = list.scrollHeight;
                }
            }, 500);
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
                <div className={"margin-t10 "+ styles.comWrite}>

                    <div className={"col-xs-10 " + styles.comAreaContainer}>
                        <Field className={styles.comArea}
                            component={textAreaField}
                            id="areaChat"
                            name="com"
                            maxLength={cfg.formChatLength}
                            rows={cfg.formChatRow}
                            placeholder={"Commenter..."}
                        />
                    </div>
                    <button className={"btn btn-blue margin-b10"}>
                        Envoyer
                    </button>

                </div>
            </form>

        );
    }

}

export default FormChat;
