import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import auth from './authReducer';
import art from './artReducer';
import search from './searchReducer';

export default combineReducers({
    art,
    auth,
    search,

    form: formReducer,
    routing: routerReducer // Add the reducer to your store on the `routing` key
});
