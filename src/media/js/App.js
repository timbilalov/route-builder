import React from 'react';
import FieldsList from './containers/FieldsList';
import Map from './containers/Map';
import Controls from './containers/Controls';
import LocalStorage from './components/LocalStorage';
import Utils from './utils/Utils';

function getInitialState() {
	const defaultState = {
		addresses: [],
	};
	const stateFromStorage = LocalStorage.getState();

	return stateFromStorage || defaultState;
}

class App extends React.Component {
	state = getInitialState();

	constructor(props) {
		super(props);
		this.addressesRawData = this.state.addresses || [];
		this.updateAppStateDebounced = Utils.debounce(this.updateAppState, 1000);
	}

	onAddressesChange(addresses, immediately = false) {
		if (!Array.isArray(addresses)) {
			return;
		}

		this.addressesRawData = addresses;
		if (immediately) {
			this.updateAppState();
			this.setFieldsValues();
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

	async onAddressesClear() {
		this.addressesRawData = [];
		await this.updateAppState();
		this.setFieldsValues();
	}

	async updateAppState() {
		const addresses = this.addressesRawData.slice(0);
		await this.setState({
			addresses,
		});

		LocalStorage.setState(this.state);
	}

	render() {
		const { addresses } = this.state;
		return (
			<>
				<FieldsList
					ref={'fieldsList'}
					addresses={addresses}
					onAddressesChange={this.onAddressesChange.bind(this)}
				/>
				<Controls addresses={addresses} onAddressesClear={this.onAddressesClear.bind(this)} />
				<Map addresses={addresses} />
			</>
		);
	}
}

export default App;
