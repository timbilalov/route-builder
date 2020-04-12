import { DEFAULT_PACE, DEFAULT_STAGE_VALUE, DEFAULT_STAGES } from './constants';

function getSpeedByPace(pace = DEFAULT_PACE) {
	return pace.split(':').reduce((p, c) => {
		const minutes = parseInt(p) + parseInt(c) / 60;
		return 1 / (minutes / 60); // km/h
	});
}

export function getPrettyDuration(distance = 0, pace = DEFAULT_PACE) {
	const speed = getSpeedByPace(pace);
	const durationByPace = Math.round((distance / 1000) / speed * 60);
	return `~ ${durationByPace} мин (при темпе ${pace})`;
}

export function getStageAddresses(stages) {
	return stages.values[stages.currentIndex].addresses;
}

export function getDefaultStageValue() {
	const defaultStageValue = Object.assign({}, DEFAULT_STAGE_VALUE);

	for (const prop in defaultStageValue) {
		const propValue = defaultStageValue[prop];

		if (Array.isArray(propValue)) {
			defaultStageValue[prop] = Array.from(propValue);
		} else if (typeof propValue === 'object') {
			defaultStageValue[prop] = Object.assign(propValue);
		}
	}

	return defaultStageValue;
}

export function getDefaultStagesObject() {
	const defaultStageValue = getDefaultStageValue();

	return Object.assign({}, DEFAULT_STAGES, {
		values: [defaultStageValue],
	});
}
