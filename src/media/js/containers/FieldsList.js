import React from 'react';
import { FieldBlock } from '../components/FieldBlock';

export class FieldsList extends React.Component {
	constructor(props) {
		super(props);
	}

	onFieldChange(event, index) {
		const value = event.target.value;
		const addresses = this.props.addresses.slice(0);

		if (value) {
			addresses[index] = value;
		} else {
			addresses.splice(index, 1);
		}

		this.props.onAddressesChange(addresses);
	}

	onRemoveButtonClick(target) {
		const value = target.value;
		const addresses = this.props.addresses.slice(0);
		const index = addresses.indexOf(value);

		if (index === -1) {
			return;
		}

		addresses.splice(index, 1);
		this.props.onAddressesChange(addresses, true);
	}

	render() {
		const inputs = [];
		const count = this.props.addresses.length;

		for (let i = 0; i < count + 1; i++) {
			inputs.push(
				<FieldBlock
					key={i}
					order={i + 1}
					ref={'fieldBlock' + (i + 1)}
					onChange={event => this.onFieldChange(event, i)}
					value={this.props.addresses[i]}
					onRemoveButtonClick={this.onRemoveButtonClick.bind(this)}
				/>
			);
		}

		return <div>{inputs}</div>;
	}
}
