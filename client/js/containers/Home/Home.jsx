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
    FormSignup,
    FrontArtTrend,
    // ModalArt,
} from '../../components';

@connect(state => ({
    user: state.auth.user,
    artProfile: state.art.artProfile,
}))
class Home extends Component {

    render() {
        const {user, artProfile} = this.props;

        return (
            <div>
                {!user &&
                    <div className="center-block">
                        <FrontWelcome/>
                        <div className="col-xs-5 col-xs-offset-1">
                            <h1>Inscription</h1>
                            <FormSignup/>
                        </div>
                    </div>
                }
                {user &&
                    <FrontArtTrend>
                        <DividerText/>
                        <BtnContainer>
                            <BtnSkip />
                            <BtnLikeArt art={artProfile}/>
                            <BtnComment art={artProfile} jump/>
                            <BtnShare art={artProfile}/>
                        </BtnContainer>
                    </FrontArtTrend>
                }
            </div>
        );
    }
}

export default Home;
