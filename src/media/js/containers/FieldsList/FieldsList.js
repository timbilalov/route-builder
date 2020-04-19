import React from 'react';
import FieldBlock from './components/FieldBlock';
import store from '../../store';
import { addAddress, editAddress, removeAddress } from '../../store/actions';
import { connect } from 'react-redux';
import VoiceInput from '../../components/VoiceInput';
import { getDefaultStagesObject, getStageAddresses } from '../../utils/helpers';

class FieldsList extends React.Component {
	static defaultProps = {
		stages: getDefaultStagesObject(),
	};

	onFieldChange(value, index) {
		const { stages } = this.props;
		const addresses = getStageAddresses(stages);
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
