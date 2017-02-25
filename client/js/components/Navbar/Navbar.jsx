import React, {Component} from 'react';
import { Link } from 'react-router';
import styles from './Navbar.scss';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        // <img src="https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/13729036_10210364491130439_6817853708507415078_n.jpg?oh=b13eeb5c58dea5499352596c7cc9bf67&oe=58C3A542" id="bandimg"/>
        // <FlatButton />
        // <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-navbar-collapse-1" aria-expanded="false">
        //     <span className="sr-only">Toggle navigation</span>
        //     <span className="icon-bar"></span>
        //     <span className="icon-bar"></span>
        //     <span className="icon-bar"></span>
        // </button>

        return (
                <nav className={"navbar navbar-default container-fluid " + styles.navbarGlobal}>
                    <div className={"center-block "  + styles.navbarContainer}>
                        <div className="navbar-header">
                            <Link to='/'>
                                <span className={"navbar-brand " + styles.bandMuseetic}>
                                    Museetic
                                </span>
                            </Link>
                        </div>


                        <div className="collapse navbar-collapse" id="bs-navbar-collapse-1">
                            <ul className="nav navbar-nav navbar-right">
                                {this.props.children}
                            </ul>
                        </div>


                    </div>
                </nav>
        );
    }
}

export default Navbar;
