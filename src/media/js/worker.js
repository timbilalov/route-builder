import { findAllPermutations, findMinRouteDistance } from './utils/helpers';
import { USE_JSON_FOR_WEBWORKER_DATA } from './utils/constants';

function onMessage(event) {
	const { data } = event;
	if (typeof data !== 'object') {
		throw new Error(`Wrong argument's type for worker's postMessage function: object required, but ${typeof data} passed.`);
	}

	let result = null;
	const { type, value } = data;

	switch (type) {
		case 'permutations':
			if (typeof value === 'number') {
				result = findAllPermutations(value);
			}
			break;

		case 'minRouteDistance':
			if (typeof value === 'object') {
				const { routeVariants, coordinates } = value;
				result = findMinRouteDistance(routeVariants, coordinates);
			}
			break;

		case 'combinedRouteCalc':
			if (typeof value === 'object') {
				const { coordinates } = value;
				const length = coordinates.length - 1;
				const permutations = findAllPermutations(length);
				const routeVariants = permutations.map(el => [0].concat(el));
				result = findMinRouteDistance(routeVariants, coordinates);
			}
			break;
	}

	result = USE_JSON_FOR_WEBWORKER_DATA ? JSON.stringify(result) : result;
	postMessage(result);
}

// Respond to message from parent thread
self.addEventListener('message', onMessage);
