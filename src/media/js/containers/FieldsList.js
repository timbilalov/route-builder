import React from 'react';
import FieldBlock from '../components/FieldBlock';

class FieldsList extends React.Component {
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

	onRemoveButtonClick(value) {
		const addresses = this.props.addresses.slice(0);
		const index = addresses.indexOf(value);

		if (index === -1) {
			return;
		}

		addresses.splice(index, 1);
		this.props.onAddressesChange(addresses, true);
	}

	render() {
		const fieldsToShow = this.props.addresses.slice(0).concat(['']);
		return (
			<>
				{fieldsToShow.map((value, index) => (
					<FieldBlock
						key={index}
						order={index + 1}
						ref={'fieldBlock' + (index + 1)}
						onChange={event => this.onFieldChange(event, index)}
						value={value}
						onRemoveButtonClick={value => this.onRemoveButtonClick(value)}
					/>
				))}
			</>
		);
	}
}

export default FieldsList;
