import React, {Component} from 'react';
// import {browserHistory} from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';

import { fetchMuseum, removeMuseum } from '../../actions/museumActions';

import {
    FormArt,
    FormMuseum,
    GridListArt,
} from '../../components';
import styles from './Museum.scss';

@connect(
    state => ({
        user: state.auth.user,
        museumProfile: state.museum.museumProfile,
    }),
    dispatch => bindActionCreators({
        fetchMuseum,
        removeMuseum
    }, dispatch)
)
class Museum extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            mode: 'idle',
        };
        this.onRemoveMuseum = this.onRemoveMuseum.bind(this);
        this.onClickEdit = this.onClickEdit.bind(this);
        this.onClickBack = this.onClickBack.bind(this);
        this.onClickAdd = this.onClickAdd.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        this.props.fetchMuseum(this.props.params.id);
    }

    onClickEdit() {
        this.setState({mode: 'edit'});
    }

    onClickAdd() {
        this.setState({mode: 'add'});
    }

    onClickBack() {
        //NOTE: reload for google map...
        // window.location.reload();
        this.setState({mode: 'idle'});
    }

    handleOpen() {
        this.setState({open: true});
    }

    handleClose() {
        this.setState({open: false});
    }

    onRemoveMuseum() {
        this.handleClose();
        this.props.removeMuseum(this.props.museumProfile._id);
    }

    render() {
        const { museumProfile, user } = this.props;


        const btnBack = (
            <a href="javascript:"
                className={styles.btnBack}
                onClick={this.onClickBack}>
                <i className="fa fa-chevron-left"/>
            </a>
        );

        const openInNewTab = (e) => {
            e.preventDefault();
            const win = window.open(museumProfile.url, '_blank');
            win.focus();
        };

        const actions = [
            <FlatButton
                label="Annuler"
                primary
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Confirmer"
                primary
                onTouchTap={this.onRemoveMuseum}
            />,
        ];

        return (
            <div>
                {
                    museumProfile && this.state.mode === 'idle' &&
                    <div className="row">
                        <Paper className={"col-xs-3 " + styles.leftContainer} zDepth={1}>
                            <div className={styles.picContainer}>
                                <Avatar
                                    className={styles.pic}
                                    src={museumProfile.picture}
                                    size={175}
                                />
                            </div>
                            <h4>{museumProfile.name}</h4>
                            <a href={museumProfile.url} onClick={openInNewTab}>
                                <i className="fa fa-external-link"/> Site web
                            </a>

                            {
                                user && (user.role === 'admin' || user.role === 'moderator') &&
                                <div>
                                    <button className="btn btn-info margin-t5" onClick={this.onClickEdit}>
                                        <i className="fa fa-pencil-square-o"/> Éditer
                                    </button>
                                    <button className="btn btn-primary margin-t5 margin-l5" onClick={this.handleOpen}>
                                        <i className="fa fa-times"/> Supprimer
                                    </button>

                                    <div>
                                        <button className="btn btn-info margin-t5" onClick={this.onClickAdd}>
                                            <i className="fa fa-plus"/> Ajouter une œuvre
                                        </button>
                                    </div>

                                    <Dialog
                                        title="Supprimer ce musée?"
                                        actions={actions}
                                        modal={false}
                                        open={this.state.open}
                                        onRequestClose={this.handleClose}
                                    />
                                </div>
                            }

                            <div id="map" className={styles.map} />

                        </Paper>
                        <div className="col-xs-9">
                            <Paper className={"col-xs-12 " + styles.rightContainer} zDepth={1}>
                                <Tabs>
                                    <Tab label="PRESENTATION">
                                        <div className="margin-15">
                                            {museumProfile.desc}
                                        </div>
                                    </Tab>
                                    <Tab label="COLLECTION">
                                        <GridListArt list={museumProfile.arts}/>
                                    </Tab>
                                    <Tab label="HORAIRE & TARIF">
                                        <div className="margin-15">
                                            <h3>
                                                Ouverture
                                            </h3>
                                            {museumProfile.open}
                                            <h3>
                                                Fermeture
                                            </h3>
                                            {museumProfile.close}
                                            <h3>
                                                Tarif
                                            </h3>
                                            {museumProfile.tarif}
                                        </div>
                                    </Tab>
                                    <Tab label="CONTACT">
                                        <div className="margin-15">
                                            <h3>
                                                Adresse
                                            </h3>
                                            {museumProfile.address}
                                            <h3>
                                                Contact
                                            </h3>
                                            <i className="fa fa-phone"/>
                                            { museumProfile.tel &&
                                                "  " + museumProfile.tel
                                            }
                                            <br/>
                                            <i className="fa fa-fax"/> {museumProfile.fax}
                                        </div>
                                    </Tab>
                                </Tabs>
                            </Paper>
                        </div>
                    </div>
                }
                {
                    museumProfile && this.state.mode === 'edit' &&
                    <Paper className={"col-xs-6 col-xs-offset-3"}>
                        <div>
                            <h2>{btnBack}</h2>
                            <h2 className="text-center">Editer</h2>
                            <Divider />
                            <FormMuseum />
                        </div>
                    </Paper>
                }
                {
                    museumProfile && this.state.mode === 'add' &&
                    <Paper className={"col-xs-6 col-xs-offset-3"}>
                        <div>
                            <h2>{btnBack}</h2>
                            <h2 className="text-center">Nouvelle œuvre</h2>
                            <Divider />
                            <FormArt new/>
                        </div>
                    </Paper>
                }
            </div>
        );
    }
}

export default Museum;
