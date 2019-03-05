import { TweenMax } from 'gsap';

global.TweenMax = TweenMax;
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
			Map: require('./modules/Map'),
			VoiceInput: require('./modules/VoiceInput'),
			VoiceInput2: require('./modules/VoiceInput2'),
		};
	});
}();

// App → ProjectName
(global.RB = global.App = App), delete global.App; //eslint-disable-line

if (module.hot) {
	module.hot.accept();
}
