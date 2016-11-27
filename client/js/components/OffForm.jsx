import React, {Component} from 'react'
import DividerText from './DividerText.jsx';
import GoogleButton from './GoogleButton.jsx';
import FacebookButton from './FacebookButton.jsx';
import ProfileButton from './ProfileButton.jsx';
import TextField from 'material-ui/TextField';
import { Link } from 'react-router';

class OffForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        }
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleEmailChange(e) {
        this.setState({email: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.onLoginSubmit({
            email: this.state.email,
            password: this.state.password,
        });
    }

    render() {
        var signupText = "Pas encore inscrit ?"

        return (
            <div id="dropdown-div" className="dropdown-menu">
                <FacebookButton divClass="socialDiv" buttonText="Se connecter avec Facebook"/>
                <GoogleButton divClass="socialDiv" buttonText="Se connecter avec Google"/>
                <DividerText text="ou" />
                <form action="/signup" method="post">

                    <input
                        id="user_username"
                        className="form-control"
                        value={this.state.email}
                        onChange={this.handleEmailChange}
                        name="email"
                        type="text"
                        placeholder="Adresse e-mail"
                        size="30"/>
                    <input
                        id="user_password"
                        className="form-control"
                        value={this.state.password}
                        onChange={this.handlePasswordChange}
                        name="password"
                        type="password"
                        placeholder="Mot de passe"
                        size="30"/>

                    <button type="submit" className="btn btn-primary dropdown-button" onClick={this.handleSubmit}>
                        Se connecter
                    </button>

                    <p>
                        <label>
                            {signupText}
                        </label>
                    </p>
                    <Link to="signup">
                        <span className="btn btn-success dropdown-button">
                            Créer un compte
                        </span>
                    </Link>
                </form>
            </div>

        );
    }

}

export default OffForm;
