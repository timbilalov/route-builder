import {
	ADD_ADDRESS,
	CLEAR_ADDRESSES,
	EDIT_ADDRESS,
	REMOVE_ADDRESS, REMOVE_STAGE,
	SET_ACTIVE_STAGE,
	SET_ADDRESSES,
} from '../actions';
import LocalStorage from '../../components/LocalStorage';
import { STAGES_STORAGE_KEY } from '../../utils/constants';
import { getDefaultStagesObject, getDefaultStageValue } from '../../utils/helpers';

const savedStages = LocalStorage.getItem(STAGES_STORAGE_KEY);

export default function stages(state = savedStages || getDefaultStagesObject(), action) {
	const { type } = action;
	let newState = Object.assign({}, state);
	const { currentIndex, values } = newState;
	const stagesCount = values.length;
	const currentValue = values[currentIndex];
	const currentStageAddresses = currentValue.addresses;

	switch (type) {
		case SET_ACTIVE_STAGE: {
			let { index } = action;

			index = Math.max(0, Math.min(stagesCount, index));
			const isNext = index === stagesCount;

			if (isNext) {
				if (values[stagesCount - 1] && values[stagesCount - 1].addresses.length) {
					const defaultStageValue = getDefaultStageValue();
					defaultStageValue.addresses.push(currentValue.addresses[currentValue.addresses.length - 1]);
					values.push(defaultStageValue);
				} else {
					index = stagesCount - 1;
				}
			}

			newState.currentIndex = index;
			break;
		}

		case REMOVE_STAGE: {
			let { index } = action;
			const shouldRemove = stagesCount > 1 && index >= 0 && index < stagesCount;

			if (shouldRemove) {
				values.splice(index, 1);

				if (index === currentIndex && index === stagesCount - 1) {
					index -= 1;
				}
			}

			newState.currentIndex = index;
			break;
		}

		case SET_ADDRESSES: {
			const { addresses } = action;
			currentValue.addresses = addresses;
			break;
		}

		case ADD_ADDRESS: {
			const { address } = action;
			if (!currentStageAddresses.includes(address)) {
				currentStageAddresses.push(address);
			}
			break;
		}

		case REMOVE_ADDRESS: {
			const { address } = action;
			if (currentStageAddresses.includes(address)) {
				currentStageAddresses.splice(currentStageAddresses.indexOf(address), 1);
			}
			break;
		}

		case EDIT_ADDRESS: {
			const { currentAddress, newAddress } = action;
			if (currentStageAddresses.includes(currentAddress)) {
				currentStageAddresses[currentStageAddresses.indexOf(currentAddress)] = newAddress;
			}
			break;
		}

		case CLEAR_ADDRESSES: {
			currentValue.addresses = [];
			break;
		}
	}

	LocalStorage.setItem(STAGES_STORAGE_KEY, newState);
	return newState;
}
