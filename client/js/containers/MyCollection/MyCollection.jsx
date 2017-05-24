import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';

import { fetchMyCollection } from '../../actions/artActions';
import {
    GridListArt,
    HTitle,
} from '../../components';
import styles from './MyCollection.scss';

@connect(
    state => ({
        listArts: state.art.listArts,
    }),
    dispatch => bindActionCreators({
        fetchMyCollection,
    }, dispatch)
)
class MyCollection extends Component {
    componentDidMount() {
        this.props.fetchMyCollection();
    }

    render() {
        const { listArts } = this.props;

        return (
            <div>
                {listArts &&
                    <Paper className={"col-xs-10 col-xs-offset-1 " + styles.cont} zDepth={1}>
                        <HTitle title="Ma collection"/>

                        <GridListArt list={listArts} mycollection/>
                    </Paper>
                }
            </div>
        );
    }
}

export default MyCollection;
