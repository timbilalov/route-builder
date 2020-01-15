import React from 'react';
import { FieldBlock } from '../components/FieldBlock';

class FieldsList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			addresses: [],
		};
	}

	onFieldChange(event, index) {
		const value = event.target.value;
		const addresses = this.state.addresses.slice(0);

		if (value) {
			addresses[index] = value;
		} else {
			addresses.splice(index, 1);
		}

		this.setState({
			addresses,
		});
	}

	render() {
		const inputs = [];
		const count = this.state.addresses.length;

		for (let i = 0; i < count + 1; i++) {
			inputs.push(
				<FieldBlock key={i} onChange={event => this.onFieldChange(event, i)} value={this.state.addresses[i]} />
			);
		}

		return <div>{inputs}</div>;
	}
}

export default FieldsList;
