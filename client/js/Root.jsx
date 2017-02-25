import React, {Component} from 'react';
import {Router} from 'react-router';
import {Provider} from 'react-redux';
import routes from './routes';
// import DevTools from './containers/DevTools.jsx';


export default class Root extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Provider store={this.props.store}>
                <Router key={Math.random()} history={this.props.history} routes={routes(this.props.store)}/>
            </Provider>
        )
    }
}
