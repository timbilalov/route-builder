import * as React from 'react'; // eslint disable no-unused-vars
import { Provider } from 'react-redux';
import store from './store';
import ReactDOM from 'react-dom';
import ReactApp from './App';

global.$ = global.jQuery = require('jquery');
require('./utils/jqExtensions');

global.RB && window.location.reload();

// prettier-ignore
const App = new function App() { // eslint-disable-line
	// Startup
	$(() => {
		this.dom = require('./utils/DOM');
		this.env = require('./utils/ENV');
		this.modules = {
		};
	});

	ReactDOM.render(
		<Provider store={store}>
			<ReactApp />
		</Provider>,
		document.getElementById('react-app')
	);
}();

// App → ProjectName
(global.RB = global.App = App), delete global.App; //eslint-disable-line

if (module.hot) {
	module.hot.accept();
}
