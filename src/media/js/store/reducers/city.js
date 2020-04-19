import LocalStorage from '../../components/LocalStorage';
import { CITY_STORAGE_KEY } from '../../utils/constants';
import { SET_CITY } from '../actions';

const savedState = LocalStorage.getItem(CITY_STORAGE_KEY);

export default function city(state = savedState || '', action) {
	const { type } = action;
	let newState = state;

	switch (type) {
		case SET_CITY: {
			const { city } = action;
			newState = city;
			break;
		}
	}

	LocalStorage.setItem(CITY_STORAGE_KEY, newState);
	return newState;
}
