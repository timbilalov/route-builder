import React from 'react';
import FieldsList from './containers/FieldsList/FieldsList';
import Map from './containers/Map/Map';
import Controls from './containers/Controls';
import GameStages from './containers/GameStages';

class App extends React.Component {
	render() {
		return (
			<div className="app">
				<div className="app__section _fields">
					<div className="container">
						<GameStages />
						<FieldsList />
						<Controls />
					</div>
				</div>
				<div className="app__section _map">
					<Map />
				</div>
			</div>
		);
	}
}

export default App;
