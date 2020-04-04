import { DURATION_MILTIPLIER } from './constants';

export function getPrettyDuration(durationValueRaw) {
	let duration = durationValueRaw * DURATION_MILTIPLIER;
	return '~ ' + Math.round(duration / 60) + ' мин';
}
