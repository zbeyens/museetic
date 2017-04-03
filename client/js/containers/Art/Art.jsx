import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { fetchArt } from '../../actions/artActions';
import {
    BtnComment,
    BtnContainer,
    BtnShare,
    BtnLikeArt,
    DividerText,
    ModalArt,
} from '../../components';
// import styles from './Art.scss';

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
        if (this.props.currentArt) return;

        this.props.fetchArt(this.props.params.id);
    }

    render() {
        const { currentArt, user } = this.props;

        return (
            <div>
                {currentArt &&
                    <ModalArt art={currentArt}>
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
                    </ModalArt>
                }
            </div>
        );
    }
}

export default Art;
