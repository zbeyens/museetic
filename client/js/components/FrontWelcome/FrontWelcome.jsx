import React, {Component} from 'react';
import styles from './FrontWelcome.scss';


class FrontWelcome extends Component {

    render() {

        return (
            <div className={styles.frontWelcome + " " + " col-md-6"}>
                <h2>Décrouvrez les musées belges sous un nouvel angle.</h2>
                <h3><i className="fa fa-star"/> Match</h3>
                <p>Trouvez facilement les oeuvres de votre style.</p>
                <h3><i className="fa fa-calendar-check-o"/> Meet</h3>
                <p>Envie de planifier votre prochaine visite de musée?</p>
                <h3><i className="fa fa-share-alt"/> Share</h3>
                <p>Partagez vos sélections sur les réseaux sociaux!</p>
            </div>
        );
    }
}

export default FrontWelcome;
