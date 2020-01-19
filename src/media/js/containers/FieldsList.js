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

	render() {
		const inputs = [];
		const count = this.props.addresses.length;

		for (let i = 0; i < count + 1; i++) {
			inputs.push(
				<FieldBlock key={i} onChange={event => this.onFieldChange(event, i)} value={this.props.addresses[i]} />
			);
		}

		return <div>{inputs}</div>;
	}
}
