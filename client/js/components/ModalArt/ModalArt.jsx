import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dialog from 'material-ui/Dialog';

import { closeDialog } from '../../actions/artActions';
import styles from './ModalArt.scss';

@connect(
    state => ({
        currentArt: state.art.currentArt,
        open: state.art.open,
        previousRoute: state.routing.previousRoute,
    }),
    dispatch => bindActionCreators({
        closeDialog,
    }, dispatch)
)
class ModalArt extends Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.props.closeDialog();
        if (this.props.previousRoute) {
            browserHistory.push(this.props.previousRoute);
        } else {
            browserHistory.push('/');
        }
    }

    render() {
        const { art, children } = this.props;

        return (

            <Dialog
                modal={false}
                open={this.props.open}
                onRequestClose={this.handleClose}
                autoScrollBodyContent
                contentStyle={{maxWidth: '900px'}}>

                <h3><span>{art.title}</span></h3>
                <h4>{art.author}</h4>

                <div className={styles.imgContainer}>
                    <img className={styles.imgCenter} src={art.picture} alt="" />
                </div>
                <div className={styles.descContainer}>
                    {art.desc}
                </div>

                {children}
            </Dialog>
        );
    }
}

export default ModalArt;
