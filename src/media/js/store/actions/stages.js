export const SET_ACTIVE_STAGE = 'SET_ACTIVE_STAGE';
export function setActiveStage(index) {
	return {
		type: SET_ACTIVE_STAGE,
		index,
	};
}

export const ADD_NEW_STAGE = 'ADD_NEW_STAGE';
export function addNewStage() {
	return {
		type: ADD_NEW_STAGE,
	};
}

export const REMOVE_STAGE = 'REMOVE_STAGE';
export function removeStage(index) {
	return {
		type: REMOVE_STAGE,
		index,
	};
}
