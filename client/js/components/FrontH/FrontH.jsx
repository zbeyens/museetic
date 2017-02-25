import React, {Component} from 'react';
import styles from './FrontH.scss';


class FrontH extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={styles[this.props.style]}>
                <h1>{this.props.title}</h1>

                {this.props.children}
            </div>
        );
    }
}

export default FrontH;
