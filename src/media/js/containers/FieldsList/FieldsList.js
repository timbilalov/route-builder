import React from 'react';
import FieldBlock from './components/FieldBlock';
import store from '../../store';
import { addAddress, editAddress, moveAddressAtIndex, removeAddress } from '../../store/actions';
import { connect } from 'react-redux';
import VoiceInput from '../../components/VoiceInput';
import { getDefaultStagesObject, getStageAddresses } from '../../utils/helpers';

class FieldsList extends React.Component {
	static defaultProps = {
		stages: getDefaultStagesObject(),
	};

	onFieldChange(value, index) {
		value = value.trim();

		const { stages } = this.props;
		const addresses = getStageAddresses(stages);
		const existingAddress = addresses[index];

		if (existingAddress) {
			if (value) {
				store.dispatch(editAddress(existingAddress, value));
			} else {
				store.dispatch(removeAddress(existingAddress));
			}
		} else {
			store.dispatch(addAddress(value));
		}
	}

	onRemoveButtonClick(value) {
		store.dispatch(removeAddress(value));
	}

	onFieldMove(index, direction) {
		const { stages } = this.props;
		const addresses = getStageAddresses(stages);

		if (!['up', 'down'].includes(direction) || (index === 0 && direction === 'up') || (index === addresses.length - 1 && direction === 'down')) {
			return;
		}

		const address = addresses[index];
		const moveAt = direction === 'up' ? index - 1 : index + 1;
		store.dispatch(moveAddressAtIndex(address, moveAt));
	}

	render() {
		const { stages } = this.props;
		const addresses = getStageAddresses(stages);
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
							onFieldMove={direction => this.onFieldMove(index, direction)}
						/>
					);
				})}

				<VoiceInput />
			</>
		);
	}
}

const mapStateToProps = function(state) {
	return {
		stages: state.stages,
	};
};

export default connect(mapStateToProps)(FieldsList);
