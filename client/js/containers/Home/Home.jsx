import React, {Component} from 'react';
import {connect} from 'react-redux';

import {FrontWelcome, FrontH, FormSignup, FrontArtTrend} from '../../components';

@connect(state => ({user: state.auth.user}))
class Home extends Component {

	render() {
		const {user} = this.props;

		return (
			<div>
				{!user &&
                    <div>
    					<FrontWelcome/>
    					<FrontH styleClass="homeFrontH" title="Inscription">
    						<FormSignup/>
    					</FrontH>
    				</div>
                }
				{user &&
                    <FrontArtTrend/>
                }
			</div>
		);
	}
}

export default Home;
