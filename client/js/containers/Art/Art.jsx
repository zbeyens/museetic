import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { fetchArt } from '../../actions/artActions';
import {
    BtnComment,
    BtnContainer,
    BtnShare,
    BtnLikeArt,
    DividerText,
    FormComment,
    ListArtComment,
    ModalArt,
} from '../../components';
// import comValidation from './comValidation';
import styles from './Art.scss';

@connect(
    state => ({
        user: state.auth.user,
        currentArt: state.art.currentArt,
    }),
    dispatch => bindActionCreators({
        fetchArt,
    }, dispatch)
)
class Art extends Component {
    componentDidMount() {
        this.props.fetchArt(this.props.params.id);
    }

    render() {
        const { currentArt, user } = this.props;

        return (
            <div>
                {currentArt &&
                    <ModalArt>
                        <div className={styles.art}>
                            <h3><span>{currentArt.title}</span></h3>
                            <h4>{currentArt.author}</h4>

                            <div className={styles.imgContainer}>
                                <img className={styles.imgCenter} src={currentArt.picture} alt="" />
                            </div>
                            <div className={styles.descContainer}>
                                {currentArt.desc}
                            </div>
                            <DividerText/>
                            <BtnContainer>
                                {user &&
                                    <div style={{display: 'inline'}}>
                                        <BtnLikeArt art={currentArt}/>
                                        <BtnComment art={currentArt}/>
                                    </div>
                                }
                                <BtnShare art={currentArt}/>
                            </BtnContainer>
                        </div>

                        <span className={styles.comsContainer}>
                            { user &&
                                <FormComment art={currentArt}/>
                            }

                            <ListArtComment art={currentArt}/>
                        </span>
                    </ModalArt>
                }
            </div>
        );
    }
}

export default Art;
