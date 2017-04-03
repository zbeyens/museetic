import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui/svg-icons/content/clear';

import { likeArtProfile, openDialog } from '../../actions/artActions';
import styles from './GridListArt.scss';

@connect(
    state => ({}),
    dispatch => bindActionCreators({
        likeArtProfile,
        openDialog,
    }, dispatch)
)
class GridListArt extends Component {
    constructor(props) {
        super(props);
        this.handleOpen = this.handleOpen.bind(this);
    }

    handleOpen(art) {
        browserHistory.push('/art/' + art._id);
        this.props.openDialog(art);
    }

    render() {
        const artsProfile = this.props.list;

        return (
            <div className={styles.root}>
                <GridList
                    cellHeight={270}
                    className={styles.gridList}
                    cols={3}>
                    {artsProfile.map((art, i) => (
                        <GridTile
                            key={art._id}
                            title={<a
                                href="javascript:"
                                className={styles.a}
                                onClick={() => this.handleOpen(art)}
                                key={art._id}>{art.title}
                            </a>}
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
