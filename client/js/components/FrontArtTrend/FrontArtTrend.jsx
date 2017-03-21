import React, {Component} from 'react';
// import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';

import {
    BtnContainer,
    BtnSkip,
    BtnLikeArt,
    BtnComment,
    BtnShare,
    ModalArt,
} from '../';
import { fetchArtTrend, likeArtTrend } from '../../actions/artActions';
import styles from './FrontArtTrend.scss';

@connect(
    state => ({
        artTrend: state.art.artTrend
    }),
    dispatch => bindActionCreators({
        fetchArtTrend,
        likeArtTrend,
    }, dispatch)
)
class FrontArtTrend extends Component {
    componentDidMount() {
        if (this.props.artTrend == null) {
            this.props.fetchArtTrend();
        }
    }

    render() {
        const { artTrend, children } = this.props;

        return (
            <Paper className={styles.frontArtTrend} zDepth={1}>
                {artTrend &&
                    <div>
                        <h3><span>{artTrend.title}</span></h3>
                        <h4>{artTrend.author}</h4>

                        <a href="#" data-toggle="modal" data-target={"#" + artTrend._id}>
                            <div className={styles.imgContainer}>
                                <img className={styles.imgCenter} src={artTrend.picture} alt="" />
                            </div>
                        </a>
                        {children}
                        <BtnContainer>
                            <BtnSkip />
                            <BtnLikeArt art={artTrend} likeArt={this.props.likeArtTrend}/>
                            <BtnComment art={artTrend}/>
                            <BtnShare art={artTrend}/>
                        </BtnContainer>
                        <ModalArt art={artTrend}>
                            <BtnSkip />
                            <BtnLikeArt art={artTrend} likeArt={this.props.likeArtTrend}/>
                        </ModalArt>
                    </div>
                }
            </Paper>
        );
    }
}

export default FrontArtTrend;
