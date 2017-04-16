import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    BtnContainer,
    BtnSkip,
    BtnLikeArt,
    BtnComment,
    BtnShare,
    DividerText,
    FrontWelcome,
    FrontH,
    FormSignup,
    FrontArtTrend,
    // ModalArt,
} from '../../components';

@connect(state => ({
    user: state.auth.user,
    currentArt: state.art.currentArt,
}))
class Home extends Component {

    render() {
        const {user, currentArt} = this.props;

        return (
            <div>
                {!user &&
                    <div>
                        <FrontWelcome/>
                        <FrontH styleName="homeFrontH" title="Inscription">
                            <FormSignup/>
                        </FrontH>
                    </div>
                }
                {user &&
                    <FrontArtTrend>
                        <DividerText/>
                        <BtnContainer>
                            <BtnSkip />
                            <BtnLikeArt art={currentArt}/>
                            <BtnComment art={currentArt} jump/>
                            <BtnShare art={currentArt}/>
                        </BtnContainer>
                    </FrontArtTrend>
                }
            </div>
        );
    }
}

export default Home;
