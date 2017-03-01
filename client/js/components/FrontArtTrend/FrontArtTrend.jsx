import React, {Component} from 'react';
// import { Link } from 'react-router';
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
    componentDidMount() {
        if (this.props.artTrend == null) {
            this.props.fetchArtTrend();
        }
    }

    render() {
        const { artTrend, children } = this.props;

        return (
            <div className={styles.frontArtTrend}>
                {artTrend &&
                    <div>
                        <h3><span>Musées de l'ULB</span></h3>
                        <h4>{artTrend.title}</h4>

                        <div className={styles.imgContainer}>
                            <img className={styles.imgCenter} src={artTrend.picture} alt="" />
                        </div>
                        {children}
                    </div>
                }
            </div>
        );
    }
}

export default FrontArtTrend;
