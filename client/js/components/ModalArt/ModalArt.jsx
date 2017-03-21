import React, {Component} from 'react';

import {
    BtnComment,
    BtnContainer,
    BtnShare,
    DividerText,
} from '../';
import styles from './ModalArt.scss';

class ModalArt extends Component {
    render() {
        const { art, children } = this.props;

        return (
            <div className="modal fade" id={art._id} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className={styles.modalArt + " modal-body"}>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>

                            <h3 className="modal-title" id="myModalLabel"><span>{art.title}</span></h3>
                            <h4>{art.author}</h4>

                            <div className={styles.imgContainer}>
                                <img className={styles.imgCenter} src={art.picture} alt="" />
                            </div>
                            <div className={styles.descContainer}>
                                {art.desc}
                            </div>

                            <DividerText/>
                            <BtnContainer>
                                {children}
                                <BtnComment art={art}/>
                                <BtnShare art={art}/>
                            </BtnContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalArt;
