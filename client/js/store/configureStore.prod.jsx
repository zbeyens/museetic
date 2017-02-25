import {applyMiddleware, createStore, compose} from "redux";
import reducer from "../reducers";

import thunk from 'redux-thunk';
import promise from "redux-promise-middleware";

const enhancer = applyMiddleware(promise(), thunk);

export default function configureStore(initialState) {
    const store = createStore(reducer, initialState, enhancer);

    return store;
}
