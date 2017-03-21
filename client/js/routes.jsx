import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {
    App,
    Home,
    Signup,
    Login,
    NotFound,
    UserProfile,
} from './containers';
import {loadAuth} from './actions/authActions';

export default(store) => {
    const requireLogout = (nextState, replace, cb) => {
        function checkAuth() {
            const {auth: {
                user
            }} = store.getState();
            if (user) {
                // oops, logged in, so can't be here!
                replace('/');
            }
            cb();
        }

        const state = store.getState();
        if (!(state.auth && state.auth.loaded)) {
            store.dispatch(loadAuth()).then(checkAuth);
        } else {
            console.log("already loaded");
            checkAuth();
        }
    };

    const requireLogin = (nextState, replace, cb) => {
        function checkAuth() {
            const { auth: { user }} = store.getState();
            if (!user) { //oops, not logged in, so can't be here!
                replace('/');
            }
            cb();
        }

        const state = store.getState();
        if (!(state.auth && state.auth.loaded)) {
            store.dispatch(loadAuth()).then(checkAuth);
        } else {
            console.log("already loaded");
            checkAuth();
        }
    };

    return (
        <div>
                <Route path="/" component={App}>
                    <IndexRoute component={Home}/>
                    <Route path="signup" component={Signup} onEnter={requireLogout}/>
                    <Route path="login" component={Login} onEnter={requireLogout}/>
                    <Route path="user/:id" component={UserProfile} onEnter={requireLogin}/>

                    <Route path="*" component={NotFound} status={404}/>
                </Route>
        </div>
    );
};
