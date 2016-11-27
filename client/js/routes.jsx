import React, {Component} from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App.jsx';
import FacebookButton from './components/FacebookButton.jsx';


export default (
    <Route>
        <Route path="/" component={App}>
            <Route path="signup" component={FacebookButton} />
        </Route>
    </Route>
)
