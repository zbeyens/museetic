import {applyMiddleware, createStore} from "redux";
import thunk from 'redux-thunk';
import promise from "redux-promise-middleware";

import reducer from "../reducers";

//styles.css bundle in production
const head = document.head;
const link = document.createElement('link');
link.type = 'text/css';
link.rel = 'stylesheet';
link.href = 'client/bundle/styles.css';
head.appendChild(link);

const enhancer = applyMiddleware(promise(), thunk);

export default function configureStore(initialState) {
    const store = createStore(reducer, initialState, enhancer);

    return store;
}
