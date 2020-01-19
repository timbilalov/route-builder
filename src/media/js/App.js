import React from 'react';
import { FieldsList } from './containers/FieldsList';
import { Map } from './containers/Map';

class App extends React.Component {
	// TODO: Задать стейт корневого элемента напрямую, если есть более подходящий синтаксис.
	constructor(props) {
		super(props);
		this.state = {
			addresses: [],
		};
	}

	onAddressesChange(addresses) {
		if (!Array.isArray(addresses)) {
			return;
		}

		this.setState({
			addresses,
		});
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
