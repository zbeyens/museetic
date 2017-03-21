import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    // BtnComment,
    // BtnContainer,
    // BtnInfo,
    // BtnLikeArt,
    // BtnShare,
    // BtnSkip,
    DividerText,
    FrontWelcome,
    FrontH,
    FormSignup,
    FrontArtTrend,
    // ModalArt,
} from '../../components';

@connect(state => ({user: state.auth.user}))
class Home extends Component {

    render() {
        const {user} = this.props;

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
                    </FrontArtTrend>
                }
            </div>
        );
    }
}

export default Home;
