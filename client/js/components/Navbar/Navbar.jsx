import React, {Component} from 'react';
import { Link } from 'react-router';
import styles from './Navbar.scss';

class Navbar extends Component {
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
            <nav className={"navbar navbar-default " + styles.navbarGlobal}>
                <div className={"container-fluid center-block " + styles.navbarContainer}>
                    <div className={"navbar-header " + styles.navHeader}>
                        <Link to="/news"><span className={"navbar-brand " + styles.bandMuseetic}>Museetic</span></Link>
                    </div>

                    {this.props.children}
                </div>
            </nav>
        );
    }
}

export default Navbar;
