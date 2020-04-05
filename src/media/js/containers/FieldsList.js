import React from 'react';
import FieldBlock from '../components/FieldBlock';
import store from '../store';
import { addAddress, editAddress, removeAddress } from '../store/actions';
import { connect } from 'react-redux';
import VoiceInput from '../components/VoiceInput';

class FieldsList extends React.Component {
	static defaultProps = {
		addresses: [],
	};

	// constructor() {
	// 	super();
	// 	const tt = new VoiceInput();
	// 	this.tt = tt;
	// 	window.tt = tt;
	// }

	onFieldChange(value, index) {
		const { addresses } = this.props;
		const existingAddress = addresses[index];

		if (existingAddress) {
			store.dispatch(editAddress(existingAddress, value));
		} else {
			store.dispatch(addAddress(value));
		}
	}

	onRemoveButtonClick(value) {
		store.dispatch(removeAddress(value));
	}

	render() {
		const { addresses } = this.props;
		const fieldsToShow = addresses.slice(0).concat(['']);

		return (
			<>
				{fieldsToShow.map((value, index) => {
					const randomKey = `field-input-${Math.round(Math.random() * 1000000)}`;

					return (
						<FieldBlock
							key={randomKey}
							order={index + 1}
							onChange={value => this.onFieldChange(value, index)}
							defaultValue={value}
							onRemoveButtonClick={value => this.onRemoveButtonClick(value)}
						/>
					);
				})}

				<hr/>

				<VoiceInput />
			</>
		);
	}
}

const mapStateToProps = function(state) {
	return {
		addresses: state.addresses,
	};
};

export default connect(mapStateToProps)(FieldsList);
