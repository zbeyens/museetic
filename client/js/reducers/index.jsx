import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import auth from './authReducer';
import art from './artReducer';
import museum from './museumReducer';
import chat from './chatReducer';
import user from './userReducer';

const appReducer = combineReducers({
    art,
    auth,
    chat,
    user,
    museum,

    form: formReducer,
    routing: routerReducer // Add the reducer to your store on the `routing` key
});

const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT_SUCCESS') {
        state = undefined;
    }
    //store the previous route
    if (action.type === '@@router/LOCATION_CHANGE') {
        const route = state.routing.locationBeforeTransitions;
        if (route) {
            state.routing.previousRoute = route.pathname;
        }
    }
    return appReducer(state, action);
};
export default rootReducer;
