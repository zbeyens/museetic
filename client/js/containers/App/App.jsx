import React, {Component} from 'react';
// import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { loadAuth } from '../../actions/authActions';
import {
    DividerText,
    FormChat,
    FormLogin,
    SearchName,
    SearchProfile,
    LiDropdown,
    LiLogout,
    LiNavbar,
    ListChat,
    ListChatComment,
    ModalMessages,
    Navbar,
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
                            {user &&
                                <SearchProfile />
                            }

                            {user &&
                                <ul className={"nav navbar-nav padding-t10"} >
                                    <LiNavbar route="/notifications">
                                    <div>
                                        <i className="fa fa-bell fa-lg" />
                                        { user.friendRequests.length > 0 &&
                                            <span className="badge">{user.friendRequests.length}</span>
                                        }
                                    </div> </LiNavbar>
                                </ul>
                            }
                            {user &&
                                <ul className={"nav navbar-nav padding-t10"} >
                                    <LiNavbar route="/"> <i className="fa fa-home fa-lg" /></LiNavbar>
                                </ul>
                            }
                            {user &&
                                <ul className={"nav navbar-nav padding-t10"} >
                                    <LiNavbar route="/mycollection"> <i className="fa fa-star fa-lg" /> Ma collection </LiNavbar>
                                </ul>
                            }
                            {user &&
                                <ul className={"nav navbar-nav padding-t10"} >
                                    <ModalMessages
                                        modeIdle={<ListChat />}
                                        modeNew={<SearchName />}
                                        formChat={<FormChat />}
                                        listChatComment={<ListChatComment />}
                                    />
                                </ul>
                            }
                            {user &&
                                <ul className={"nav navbar-nav padding-t10"} >
                                    <LiNavbar route="/friends"> <i className="fa fa-users fa-lg" /> Amis </LiNavbar>
                                </ul>
                            }


                            <ul className={"nav navbar-nav navbar-right padding-t10"}>
                                {!user &&
                                    <LiDropdown inside={
                                        <FormLogin>
                                            <strong>Se connecter à Museetic</strong>
                                        </FormLogin>}>
                                        Vous avez déjà un compte ? Connexion
                                        <span className="caret"/>
                                    </LiDropdown>
                                }
                                {user &&
                                    <LiDropdown inside={<LiLogout />}>
                                    {user.name} <span className="caret"/> </LiDropdown>
                                }
                            </ul>
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
