import { DEFAULT_PACE } from './constants';

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
