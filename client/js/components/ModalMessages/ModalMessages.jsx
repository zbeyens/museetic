import React, {Component} from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';

import { setDestMessage } from '../../actions/chatActions';
import styles from './ModalMessages.scss';

@connect(
    state => ({
        destUser: state.chat.destUser,
    }),
    dispatch => bindActionCreators({
        setDestMessage
    }, dispatch)
)
class ModalMessages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            mode: "idle",
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onClickNew = this.onClickNew.bind(this);
        this.onClickBack = this.onClickBack.bind(this);
    }

    componentDidMount() {
        this.url = window.location.href;
    }

    componentDidUpdate() {
        if (this.url !== window.location.href) {
            this.url = window.location.href;
            this.handleClose();
        }
    }

    handleOpen() {
        this.setState({open: true});
    }

    handleClose() {
        this.setState({open: false, mode: "idle"});
        this.props.setDestMessage(null);
    }

    onClickNew() {
        this.setState({mode: "new"});
        this.props.setDestMessage(null);
    }

    onClickBack() {
        this.setState({mode: "idle"});
        this.props.setDestMessage(null);
    }

    render() {
        const { destUser, modeIdle, modeNew, formChat, listChatComment } = this.props;

        const btnTimes = (
            <a href="javascript:"
                className={styles.btnTimes}
                onClick={this.handleClose}>
                <i className="fa fa-times"/>
            </a>
        );

        const btnBack = (
            <a href="javascript:"
                className={styles.btnBack}
                onClick={this.onClickBack}>
                <i className="fa fa-chevron-left"/>
            </a>
        );

        return (
            <li>
                <a href="javascript:" onClick={this.handleOpen}>
                    <i className="fa fa-envelope fa-lg" /> Messages
                </a>
                <Dialog
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent
                    contentClassName={styles.modalDialog}
                    contentStyle={{maxWidth: '700px', minHeight: '600px'}}>

                    {
                        this.state.mode === "idle" && !destUser &&
                        <div>
                            {btnTimes}
                            <div className="margin-b20">
                                <h3 className="modalTitle">
                                    Messages privés
                                </h3>
                                <button className={"btn btn-blue margin-r10 " + styles.btnNew}
                                    onClick={this.onClickNew}>
                                    <i className="fa fa-pencil-square-o"/> Nouveau
                                </button>
                            </div>

                            <Divider/>

                            {modeIdle}

                        </div>
                    }
                    {
                        this.state.mode === "new" && !destUser &&
                        <div>
                            {btnBack}
                            {btnTimes}
                            <div className={styles.modalHeader + " text-center"}>
                                <h3 className="modalTitle">Nouveau message</h3>
                            </div>
                            <Divider/>

                            {modeNew}
                        </div>
                    }
                    {
                        destUser !== null &&
                        <div>
                            {btnBack}
                            {btnTimes}
                            <div className={styles.modalHeader + " text-center"}>
                                <h3 className="modalTitle">
                                    <Link
                                        to={'/user/' + destUser._id}>
                                        {destUser.name}
                                    </Link>
                                </h3>
                            </div>
                            <Divider/>

                            {listChatComment}

                            <div className={styles.conversMessages}>
                                {formChat}
                            </div>

                        </div>
                    }

                </Dialog>
            </li>
        );
    }
}

export default ModalMessages;
