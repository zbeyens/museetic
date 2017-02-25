import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import auth from './authReducer';
import art from './artReducer';

export default combineReducers({
    art,
    auth,

    form: formReducer,
    routing: routerReducer // Add the reducer to your store on the `routing` key
});
