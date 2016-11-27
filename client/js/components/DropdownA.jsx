import React, {Component} from 'react';

class DropdownA extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <a href="#" className="dropdown-toggle" id="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                {this.props.text}
                <span className="caret"></span>
            </a>
        );
    }

}

export default DropdownA;
