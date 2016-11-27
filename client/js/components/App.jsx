import React, {Component} from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import OffNavbar from './OffNavbar.jsx';
import OnNavbar from './OnNavbar.jsx';

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false
        };
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.getRoot = this.getRoot.bind(this);
    }

    handleLoginSubmit(login) {
        axios.post('/signup', {
            email: login.email,
            password: login.password
        })
        .then(function(res){
            console.log(res.data);
            if (res.data.loggedIn) {
                this.setState({
                    loggedIn: res.data.loggedIn
                });
            }
            //handle erros
        }.bind(this))
        .catch(function(error){
            console.log('errors');
        });
    }

    handleLogout() {
        axios.post('/logout')
        .then(function(res){
            this.setState({
                loggedIn: false
            });
        }.bind(this))
        .catch(function(error){
            console.log('errorout');
        });
    }

    getRoot() {
        axios.get('/login')
        .then(function(res) {
            console.log(res.data);
            this.setState({
                loggedIn: res.data.loggedIn
            });
        }.bind(this))
        .catch(function(error){
            console.log('errorl');
        });
    }

    componentWillMount() {
        try {
            //useless
            injectTapEventPlugin();
        } catch(e) {}
    }

    componentDidMount() {
        this.getRoot()
    }

    render() {
        var navbar;
        console.log('rendering...');
        if (this.state.loggedIn) {
            navbar = <OnNavbar onLogout={this.handleLogout}/>
        } else {
            navbar = <OffNavbar onLoginSubmit={this.handleLoginSubmit}/>
        }

        return (
            <MuiThemeProvider>
                <div className="main-container">
                    {navbar}
                    {this.props.children}
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Main;
