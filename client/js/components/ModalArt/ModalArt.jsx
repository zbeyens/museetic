import React, {Component} from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import styles from './ModalArt.scss';

@connect(
    state => ({
        artTrend: state.art.artTrend
    })
)
class ModalArt extends Component {
    render() {
        const { artTrend, children } = this.props;

        return (
            <div className="modal fade" id="modalArt" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className={styles.modalArt + " modal-body"}>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>

                            <h3 className="modal-title" id="myModalLabel"><span>Musées de l'ULB</span></h3>
                            <h4>{artTrend.title}</h4>

                            <div className={styles.imgContainer}>
                                <img className={styles.imgCenter} src={artTrend.picture} alt="" />
                            </div>
                            <div className={styles.descContainer}>
                                {artTrend.desc}
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalArt;
