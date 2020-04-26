export const SET_ADDRESSES = 'SET_ADDRESSES';
export function setAddresses(addresses) {
	return {
		type: SET_ADDRESSES,
		addresses,
	};
}

export const ADD_ADDRESS = 'ADD_ADDRESS';
export function addAddress(address) {
	return {
		type: ADD_ADDRESS,
		address,
	};
}

export const REMOVE_ADDRESS = 'REMOVE_ADDRESS';
export function removeAddress(address) {
	return {
		type: REMOVE_ADDRESS,
		address,
	};
}

export const EDIT_ADDRESS = 'EDIT_ADDRESS';
export function editAddress(currentAddress, newAddress) {
	return {
		type: EDIT_ADDRESS,
		currentAddress,
		newAddress,
	};
}

export const CLEAR_ADDRESSES = 'CLEAR_ADDRESSES';
export function clearAddresses() {
	return {
		type: CLEAR_ADDRESSES,
	};
}

export const MOVE_ADDRESS_AT_INDEX = 'MOVE_ADDRESS_AT_INDEX';
export function moveAddressAtIndex(address, index) {
	return {
		type: MOVE_ADDRESS_AT_INDEX,
		address,
		index,
	};
}
