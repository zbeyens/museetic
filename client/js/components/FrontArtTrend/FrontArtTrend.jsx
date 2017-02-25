import React, {Component} from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { fetchArtTrend } from '../../actions/artActions';
import styles from './FrontArtTrend.scss';

@connect(
    state => ({
        artTrend: state.art.artTrend
    }),
    dispatch => bindActionCreators({
        fetchArtTrend
    }, dispatch)
)
class FrontArtTrend extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.artTrend == null) {
            this.props.fetchArtTrend();
        }
    }

    render() {
        const { artTrend } = this.props;
        // console.log(this.props.art);

        return (
                <div className={styles.FrontArtTrend}>
                    {artTrend &&
                        <div>
                            <h3>Musées de l'ULB</h3>

                            <strong>
                                {artTrend.title}
                            </strong>

                            <img src={artTrend.picture} alt="" />
                            <div className="">
                                {artTrend.desc}
                            </div>
                        </div>
                }
                </div>
        );
    }
}

export default FrontArtTrend;
