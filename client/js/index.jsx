import React from 'react';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import {syncHistoryWithStore} from 'react-router-redux';
import {browserHistory} from 'react-router';
import Root from './Root';
import configureStore from './store/configureStore';

if (module.hot) {
	module.hot.accept();
}

// Check for token and update application state if required
// localStorage.setItem('token', "Salut");
const initialState = {
	// token: localStorage.getItem('token'),
};
// console.log(initialState.token);

const store = configureStore(initialState);
// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);
window.onbeforeunload = () => {
	// const {token} = store.getState();
	//
	// localStorage.setItem('token', "1");
};

const rootEl = document.getElementById('root');
render(
	<AppContainer>
	<Root store={store} history={history}/>
</AppContainer>, rootEl);

if (module.hot) {
	module.hot.accept('./Root', () => {
		const NextRoot = require('./Root').default;
		render(
			<AppContainer>
			<NextRoot store={store} history={history}/>
		</AppContainer>, rootEl);
	});
}
