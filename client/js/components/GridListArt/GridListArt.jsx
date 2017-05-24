import React, {Component} from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui/svg-icons/content/clear';

import { likeArtProfile } from '../../actions/artActions';
import styles from './GridListArt.scss';

@connect(
    state => ({}),
    dispatch => bindActionCreators({
        likeArtProfile,
    }, dispatch)
)
class GridListArt extends Component {
    render() {
        const artsProfile = this.props.list;

        return (
            <div className={"margin-t10 " + styles.root}>
                <GridList
                    cellHeight={270}
                    className={styles.gridList}
                    cols={3}>
                    {artsProfile.map((art, i) => (
                        <GridTile
                            key={art._id}
                            title={
                                <Link to={'/art/' + art._id} className={styles.a}>
                                {art.title}
                            </Link>}
                            subtitle={<span>de <b>{art.author}</b></span>}
                            actionIcon={
                                this.props.mycollection &&
                                <IconButton onClick={() => this.props.likeArtProfile(art._id, i)}>
                                    <Clear color="white" />
                                </IconButton>
                            }>
                            <img src={art.picture} alt=""/>
                        </GridTile>
                    ))}

                </GridList>
            </div>
        );
    }
}

export default GridListArt;
