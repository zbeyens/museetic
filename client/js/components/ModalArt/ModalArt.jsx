import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dialog from 'material-ui/Dialog';

import styles from './ModalArt.scss';

@connect(
    state => ({
        currentArt: state.art.currentArt,
        previousRoute: state.routing.previousRoute,
    }),
    dispatch => bindActionCreators({}, dispatch)
)
class ModalArt extends Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        if (this.props.previousRoute) {
            browserHistory.push(this.props.previousRoute);
        } else {
            browserHistory.push('/');
        }
    }

    render() {
        const { children } = this.props;

        const btnTimes = (
            <a href="javascript:"
                className={styles.btnTimes}
                onClick={this.handleClose}>
                <i className="fa fa-times"/>
            </a>
        );

        return (
            <Dialog
                modal={false}
                open
                onRequestClose={this.handleClose}
                autoScrollBodyContent
                contentClassName={styles.modalDialog}
                contentStyle={{maxWidth: '900px'}}>
                {btnTimes}
                {children}
            </Dialog>
        );
    }
}

export default ModalArt;
