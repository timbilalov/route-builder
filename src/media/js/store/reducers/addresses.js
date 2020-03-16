import { ADD_ADDRESS, CLEAR_ADDRESSES, EDIT_ADDRESS, REMOVE_ADDRESS, SET_ADDRESSES } from '../actions';
import LocalStorage from '../../components/LocalStorage';
import { ADDRESSES_STORAGE_KEY } from '../../utils/constants';

const savedAddresses = LocalStorage.getItem(ADDRESSES_STORAGE_KEY);

export default function addresses(state = savedAddresses || [], action) {
	const { type } = action;

	switch (type) {
		case SET_ADDRESSES: {
			const { addresses } = action;
			const newState = [...addresses];

			return newState;
		}

		case ADD_ADDRESS: {
			const { address } = action;
			const newState = state.slice(0);

			newState.push(address);

			return newState;
		}

		case EDIT_ADDRESS: {
			const { currentAddress, newAddress } = action;
			const newState = state.slice(0);
			const currentAddressIndex = newState.indexOf(currentAddress);

			if (currentAddressIndex === -1) {
				return state;
			}
			newState[currentAddressIndex] = newAddress;

			return newState;
		}

		case REMOVE_ADDRESS: {
			const { address } = action;
			const newState = state.slice(0);
			const addressIndex = newState.indexOf(address);

			if (addressIndex === -1) {
				return state;
			}
			newState.splice(addressIndex, 1);

			return newState;
		}

		case CLEAR_ADDRESSES: {
			return [];
		}

		default:
			return state;
	}
}
