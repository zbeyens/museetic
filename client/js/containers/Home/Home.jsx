import React, {Component} from 'react';
import { connect } from 'react-redux';

import {
    FrontWelcome,
    FrontH,
    FormSignup,
    FrontArtTrend,
} from '../../components';
// import styles from './Home.scss';

@connect(
    state => ({
        user: state.auth.user,
    })
)
class Home extends Component {

    render() {
        const { user } = this.props;

        return (
            <div>
                {!user &&
                    <div>
                        <FrontWelcome />
                        <FrontH
                            style="homeFrontH"
                            title="Inscription">
                            <FormSignup />
                        </FrontH>
                    </div>
                }
                {user &&
                    <FrontArtTrend>

                    </FrontArtTrend>
                }
            </div>
        );
    }
}

export default Home;
