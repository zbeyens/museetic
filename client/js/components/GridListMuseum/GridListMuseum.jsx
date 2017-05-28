import React, {Component} from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {GridList, GridTile} from 'material-ui/GridList';

import styles from './GridListMuseum.scss';

@connect(
    state => ({
        listMuseum: state.museum.listMuseum,
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)
class GridListMuseum extends Component {
    render() {
        const { listMuseum } = this.props;

        return (
            <div>
                {listMuseum &&
                    <GridList
                        cellHeight={200}
                        className={styles.gridList}
                        cols={4}>
                        {listMuseum.map((museum, i) => (
                            <GridTile
                                key={museum._id}
                                title={
                                    <Link to={'/museum/' + museum._id} className={styles.a}>
                                    {museum.name}
                                </Link>} >
                                <img src={museum.picture} alt=""/>
                            </GridTile>
                        ))}

                    </GridList>
                }
            </div>
        );
    }
}

export default GridListMuseum;
