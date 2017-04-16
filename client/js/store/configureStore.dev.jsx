import {applyMiddleware, createStore, compose} from "redux";
import reducer from "../reducers";

//allows actions to return a function and to dispatch several time within one action creator.
import thunk from 'redux-thunk';
import promise from "redux-promise-middleware";
import logger from "redux-logger";


// import DevTools from '../containers/DevTools';
// const enhancer = compose(
//   // Middleware you want to use in development:
//   applyMiddleware((promise(), thunk)), //, logger()),
//   // Required! Enable Redux DevTools with the monitors you chose
//   // is disabled in production by default
//   DevTools.instrument()
// );
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(
    applyMiddleware(promise(), thunk), //, logger()),
);
// create the saga middleware

export default function configureStore(initialState) {
    const store = createStore(reducer, initialState, enhancer);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers');
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}
