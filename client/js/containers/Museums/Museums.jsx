import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';


import { fetchAllMuseums, fetchLikedMuseums } from '../../actions/museumActions';
import {
    FormMuseum,
    GridListMuseum
} from '../../components';
import styles from './Museums.scss';

@connect(
    state => ({
        user: state.auth.user,
    }),
    dispatch => bindActionCreators({
        fetchAllMuseums,
        fetchLikedMuseums,
    }, dispatch)
)
class Museums extends Component {
    constructor(props) {
        super(props);
        this.handleActiveAll = this.handleActiveAll.bind(this);
        this.handleActiveLiked = this.handleActiveLiked.bind(this);
    }

    componentDidMount() {
        this.props.fetchLikedMuseums();
    }

    handleActiveLiked() {
        this.props.fetchLikedMuseums();
    }

    handleActiveAll() {
        this.props.fetchAllMuseums();
    }

    render() {
        const {user} = this.props;

        return (
            <div>
                <Paper className={"col-xs-10 col-xs-offset-1 " + styles.cont} zDepth={1}>
                    <Tabs>

                        <Tab
                            icon={<FontIcon className="material-icons">favorite</FontIcon>}
                            onActive={this.handleActiveLiked} >
                            <GridListMuseum />
                        </Tab>
                        <Tab
                            icon={<i className="fa fa-globe" />}
                            onActive={this.handleActiveAll} >
                            <GridListMuseum />
                        </Tab>
                        { user && (user.role === 'admin' || user.role === 'moderator') &&
                            <Tab
                                icon={<i className="fa fa-plus" />} >
                                <FormMuseum new/>
                            </Tab>
                        }
                    </Tabs>
                </Paper>
            </div>
        );
    }
}

export default Museums;
