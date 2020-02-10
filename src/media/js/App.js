import React from 'react';
import { FieldsList } from './containers/FieldsList';
import { Map } from './containers/Map';
import { Controls } from './containers/Controls';
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

	onAddressesChange(addresses, immediately = false) {
		if (!Array.isArray(addresses)) {
			return;
		}

		this.addressesRawData = addresses;
		if (immediately) {
			this.updateAppState(() => this.setFieldsValues());
		} else {
			this.updateAppStateDebounced();
		}
	}

	setFieldsValues() {
		const fieldBlocks = this.refs.fieldsList.refs;
		const addresses = this.state.addresses.slice(0);
		for (const [key, fieldBlock] of Object.entries(fieldBlocks)) {
			const index = parseInt(key.substring(key.match(/\d/).index), 10) - 1;
			fieldBlock.setState({
				value: addresses[index] || '',
			});
		}
	}

	onAddressesClear() {
		this.addressesRawData = [];
		this.updateAppState(() => this.setFieldsValues());
	}

	updateAppState(callback) {
		const addresses = this.addressesRawData.slice(0);
		this.setState(
			{
				addresses,
			},
			() => {
				this.storage('set');
				if (typeof callback === 'function') {
					callback();
				}
			}
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
				<FieldsList
					ref={'fieldsList'}
					addresses={this.state.addresses}
					onAddressesChange={this.onAddressesChange.bind(this)}
				/>
				<Controls addresses={this.state.addresses} onAddressesClear={this.onAddressesClear.bind(this)} />
				<Map addresses={this.state.addresses} />
			</div>
		);
	}
}

export default App;
