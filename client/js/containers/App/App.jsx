import React, {Component} from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadAuth, login, logout } from '../../actions/authActions';

import {
    Navbar,
    LiDropdown,
    FormLogin,
    DropdownMenu,
    LiLogout
} from '../../components';
// import OffNavbar from '../../components/OffNavbar.jsx';
// import OnNavbar from '../../components/OnNavbar.jsx';
import styles from './App.scss';


@connect(
    state => ({
        user: state.auth.user,
        loaded: state.auth.loaded,
    }),
    dispatch => bindActionCreators({
        loadAuth
    }, dispatch)
)
class App extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //load auth if router did not loaded it
        if (this.props.user == null) {
            this.props.loadAuth();
        }
    }

    render() {
        const {user, children, loaded} = this.props;
        console.log('rendering...');

        return (
            <MuiThemeProvider>
                <div className={styles.globalContainer}>
                    {loaded &&
                        <Navbar>
                            {!user &&
                                <LiDropdown a="Vous avez déjà un compte ? Connexion">
                                    <FormLogin />
                                </LiDropdown>
                            }
                            {user &&
                                <LiDropdown a={user.name}>
                                    <LiLogout />
                                </LiDropdown>
                            }
                        </Navbar>
                    }

                    {loaded &&
                        <div className={styles.contentContainer + " container center-block row"}>
                            {children}
                        </div>
                    }
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
