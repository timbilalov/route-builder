import React from 'react';
import { FieldsList } from './containers/FieldsList';
import { Map } from './containers/Map';
import Utils from './utils/Utils';

const STORAGE_KEY = 'route-builder-state';

class App extends React.Component {
	// TODO: Задать стейт корневого элемента напрямую, если есть более подходящий синтаксис.
	constructor(props) {
		super(props);

		const defaultState = {
			addresses: [],
		};
		const stateFromStorage = this.storage('get');

		this.state = stateFromStorage ? stateFromStorage : defaultState;
		this.addressesRawData = this.state.addresses || [];

		this.updateAppStateDebounced = Utils.debounce(this.updateAppState.bind(this), 1000);
	}

	onAddressesChange(addresses) {
		if (!Array.isArray(addresses)) {
			return;
		}

		this.addressesRawData = addresses;
		this.updateAppStateDebounced();
	}

	updateAppState() {
		const addresses = this.addressesRawData.slice(0);
		this.setState(
			{
				addresses,
			},
			() => this.storage('set')
		);
	}

	storage(method = 'get') {
		if (method === 'get') {
			let state = localStorage.getItem(STORAGE_KEY);
			if (state) {
				state = JSON.parse(state);
			}
			return state;
		} else if (method === 'set') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
		}
	}

	render() {
		return (
			<div>
				<FieldsList addresses={this.state.addresses} onAddressesChange={this.onAddressesChange.bind(this)} />
				<Map addresses={this.state.addresses} />
			</div>
		);
	}
}

export default App;
