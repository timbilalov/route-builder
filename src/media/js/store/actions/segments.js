export const SET_COMPLETED_SEGMENT = 'SET_COMPLETED_SEGMENT';
export function setCompletedSegment(index) {
	return {
		type: SET_COMPLETED_SEGMENT,
		index,
	};
}

export const UNSET_COMPLETED_SEGMENT = 'UNSET_COMPLETED_SEGMENT';
export function unsetCompletedSegment(index) {
	return {
		type: UNSET_COMPLETED_SEGMENT,
		index,
	};
}
