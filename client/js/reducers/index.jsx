import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import auth from './authReducer';
import art from './artReducer';
import user from './userReducer';

const appReducer = combineReducers({
    art,
    auth,
    user,

    form: formReducer,
    routing: routerReducer // Add the reducer to your store on the `routing` key
});

const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT_SUCCESS') {
        state = undefined;
    }
    return appReducer(state, action);
};
export default rootReducer;
