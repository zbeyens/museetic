import React, {Component} from 'react';
import DropdownLi from './DropdownLi.jsx';
import OffForm from './OffForm.jsx';

class OffDropdownLi extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DropdownLi text="Vous avez déjà un compte ? Connexion">
                <OffForm onLoginSubmit={this.props.onLoginSubmit}/>
            </DropdownLi>
        );
    }

}

export default OffDropdownLi;
