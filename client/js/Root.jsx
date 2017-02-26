import React from 'react';
import {Router} from 'react-router';
import {Provider} from 'react-redux';
import routes from './routes';
// import DevTools from './containers/DevTools.jsx';

const Root = function(props) {
	return (
		<Provider store={props.store}>
			<Router
				key={Math.random()}
				history={props.history}
				routes={routes(props.store)}/>
		</Provider>
	);
};

export default Root;
