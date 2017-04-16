import React, {Component} from 'react';
import Clipboard from 'clipboard';

import Snackbar from 'material-ui/Snackbar';

class BtnShare extends Component {
    constructor(props) {
        super(props);
        this.state = {open: false};
        this.onClick = this.onClick.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
    }

    componentDidMount() {
        this.cb = new Clipboard('.shareArt', {
            text: (trigger) => {
                return window.location.origin + "/art/" + this.props.art._id;
            }
        });
    }

    componentWillUnmount(nextProps, nextState) {
        this.cb.destroy();
    }

    onClick() {
        this.setState({open: true});
    }

    handleRequestClose() {
        this.setState({
            open: false,
        });
    }

    render() {
        return (
            <div style={{display: 'inline'}}>
                <button
                    className="shareArt btn btn-info btn-circle btn-lg dropdown-button"
                    onClick={this.onClick}
                    data-clipboard-text={"/"}>
                    <i className="fa fa-share-alt"/>
                </button>

                <Snackbar
                    open={this.state.open}
                    message={"Lien copié dans le presse-papier"}
                    autoHideDuration={1500}
                    onRequestClose={this.handleRequestClose}
                />
            </div>
        );
    }
}

export default BtnShare;
