import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
// import Divider from 'material-ui/Divider';

import { fetchArt, removeArt } from '../../actions/artActions';
import {
    BtnComment,
    BtnContainer,
    BtnShare,
    BtnLikeArt,
    DividerText,
    FormArt,
    FormComment,
    ListArtComment,
    ModalArt,
} from '../../components';
// import comValidation from './comValidation';
import styles from './Art.scss';

@connect(
    state => ({
        user: state.auth.user,
        artProfile: state.art.artProfile,
    }),
    dispatch => bindActionCreators({
        fetchArt,
        removeArt
    }, dispatch)
)
class Art extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            mode: 'idle',
        };
        this.onClickRemove = this.onClickRemove.bind(this);
        this.onClickEdit = this.onClickEdit.bind(this);
        this.onClickBack = this.onClickBack.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        this.props.fetchArt(this.props.params.id);
    }

    onClickEdit() {
        this.setState({mode: 'edit'});
    }

    onClickBack() {
        this.setState({mode: 'idle'});
    }

    handleOpen() {
        this.setState({open: true});
    }

    handleClose() {
        this.setState({open: false});
    }

    onClickRemove() {
        this.handleClose();
        this.props.removeArt(this.props.artProfile._id);
    }

    render() {
        const { artProfile, user } = this.props;

        const actions = [
            <FlatButton
                label="Annuler"
                primary
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Confirmer"
                primary
                onTouchTap={this.onClickRemove}
            />,
        ];

        const btnBack = (
            <a href="javascript:"
                className={styles.btnBack}
                onClick={this.onClickBack}>
                <i className="fa fa-chevron-left"/>
            </a>
        );

        return (
            <div>
                {artProfile &&
                    <ModalArt>
                        {
                            this.state.mode === 'idle' &&
                            <div>
                                <div className={styles.art}>
                                    {
                                        user && (user.role === 'admin' || user.role === 'moderator') &&
                                        <div>
                                            <button className="btn btn-primary pull-right margin-l5" onClick={this.handleOpen}>
                                                <i className="fa fa-times"/> Supprimer
                                            </button>
                                            <button className="btn btn-info pull-right" onClick={this.onClickEdit}>
                                                <i className="fa fa-pencil-square-o"/> Éditer
                                            </button>

                                            <Dialog
                                                title="Supprimer cette oeuvre?"
                                                actions={actions}
                                                modal={false}
                                                open={this.state.open}
                                                onRequestClose={this.handleClose} />
                                            </div>
                                        }
                                        <h2><span>{artProfile.title}</span></h2>
                                        <h3><span>{artProfile.subtitle}</span></h3>
                                        {artProfile.museum &&
                                            <Link to={'/museum/' + artProfile.museum._id} className={styles.a}>
                                            {artProfile.museum.name} </Link>
                                        }

                                        <div className={styles.imgContainer}>
                                            <img className={styles.imgCenter} src={artProfile.picture} alt="" />
                                        </div>
                                        <div className={styles.descContainer}>
                                            <div>
                                                <strong>{artProfile.abstract}</strong>
                                            </div>
                                            <div>
                                                {artProfile.desc}
                                            </div>
                                        </div>
                                        <DividerText/>
                                        <BtnContainer>
                                            {user &&
                                                <div style={{display: 'inline'}}>
                                                    <BtnLikeArt art={artProfile}/>
                                                    <BtnComment art={artProfile}/>
                                                </div>
                                            }
                                            <BtnShare art={artProfile}/>
                                        </BtnContainer>
                                    </div>

                                    <span className={styles.comsContainer}>
                                        { user &&
                                            <FormComment art={artProfile}/>
                                        }

                                        <ListArtComment art={artProfile}/>
                                    </span>
                            </div>
                            }
                            {
                                this.state.mode === 'edit' &&
                                <div className="margin-t10 margin-b20">
                                    <div>
                                        <strong className="pull-left margin-l20">{btnBack}</strong>
                                        <h3 className="text-center">Éditer</h3>
                                    </div>
                                    <FormArt />
                                </div>
                            }
                        </ModalArt>
                    }
                </div>
            );
        }
    }

    export default Art;
