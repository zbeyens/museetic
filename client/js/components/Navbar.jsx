import React, {Component} from 'react';
import FontIcon from 'material-ui/FontIcon';
import { Link } from 'react-router';

class Navbar extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        // <img src="https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/13729036_10210364491130439_6817853708507415078_n.jpg?oh=b13eeb5c58dea5499352596c7cc9bf67&oe=58C3A542" id="bandimg"/>
        // <FlatButton />

        return (
            <nav className="navbar navbar-default home" id="navbar">
                <div className="navbar-header">
                    <Link to='/'>
                        <span className="navbar-brand" id="band">
                            Museetic
                        </span>
                    </Link>
                </div>


                <div className="navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav navbar-right">
                        {this.props.children}
                    </ul>
                </div>

            </nav>
        );
    }
}

export default Navbar;
