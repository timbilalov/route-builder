import React from 'react';
import FieldsList from './containers/FieldsList/FieldsList';
import Map from './containers/Map/Map';
import Controls from './containers/Controls';
import GameStages from './containers/GameStages';
import CitySelection from './containers/CitySelection';
import LocalStorage from './components/LocalStorage';
import { EXPORT_HREF_PARAM_NAME } from './utils/constants';

class App extends React.Component {
	componentDidMount() {
		const hash = window.location.hash;
		if (!hash) {
			return;
		}

		let urlToReload = window.location.href;
		urlToReload = urlToReload.replace(hash, '');

		const encodedValues = hash.substring(EXPORT_HREF_PARAM_NAME.length + 2);
		const decodedValues = LocalStorage.import(encodedValues);

		if (decodedValues) {
			window.location.href = urlToReload;
		}
	}

	render() {
		return (
			<div className="app">
				<div className="app__section _fields">
					<CitySelection />
					<GameStages />
					<FieldsList />
					<Controls />
				</div>
				<div className="app__section _map">
					<Map />
				</div>
			</div>
		);
	}
}

export default App;
