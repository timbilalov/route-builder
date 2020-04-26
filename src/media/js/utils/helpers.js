import { DEFAULT_PACE, DEFAULT_STAGE_VALUE, DEFAULT_STAGES } from './constants';

function getSpeedByPace(pace = DEFAULT_PACE) {
	return pace.split(':').reduce((p, c) => {
		const minutes = parseInt(p) + parseInt(c) / 60;
		return 1 / (minutes / 60); // km/h
	});
}

export function getPrettyDuration(distance = 0, pace = DEFAULT_PACE, showPaceDescription = true) {
	const speed = getSpeedByPace(pace);
	const durationByPace = Math.round((distance / 1000) / speed * 60);
	let resultString = `~ ${durationByPace} мин`;
	if (showPaceDescription) {
		resultString += ` (при темпе ${pace})`;
	}
	return resultString;
}

export function getStageAddresses(stages) {
	return stages.values[stages.currentIndex].addresses || Array.from(DEFAULT_STAGE_VALUE.addresses);
}

export function getStageCompletedSegments(stages) {
	return stages.values[stages.currentIndex].completedSegments || Array.from(DEFAULT_STAGE_VALUE.completedSegments);
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

export function factorial(n) {
	if (isNaN(n)) {
		console.warn(`Wrong argument's type for function 'factorial': number required, but ${typeof n} passed.`);
		return;
	}

	if (n === 1) {
		return 1;
	} else {
		return n * factorial(n - 1);
	}
}

// https://en.wikipedia.org/wiki/Permutation
// https://en.wikipedia.org/wiki/Heap%27s_algorithm
// https://stackoverflow.com/questions/40598891/heaps-algorithm-walk-through
// http://ruslanledesma.com/2016/06/17/why-does-heap-work.html
export function findAllPermutations(length) {
	if (isNaN(length)) {
		console.warn(`Wrong argument's type for function 'findAllPermutations': number required, but ${typeof length} passed.`);
		return;
	}

	const t1 = performance.now();
	const permutations = [];
	const permutationsRightCount = factorial(length);

	// NOTE: Для правильной работы алгоритма замены должны производиться именно с этим массивом, менять его.
	const array = Array.from(new Array(length)).map((el, index) => index + 1);

	function generate(n, arr) {
		if (n === 1) {
			permutations.push(Array.from(arr));
		} else {
			generate(n - 1, arr);

			for (var i = 0; i < n - 1; i++) {
				if (n % 2 === 0) {
					const a = arr[i];
					const b = arr[n - 1];
					arr[i] = b;
					arr[n - 1] = a;
				} else {
					const a = arr[0];
					const b = arr[n - 1];
					arr[0] = b;
					arr[n - 1] = a;
				}

				generate(n - 1, arr);
			}
		}
	}

	generate(length, array);

	const permutationsUniqueCount = new Set(permutations.map(el => el.toString())).size;
	if (permutations.length !== permutationsRightCount || permutations.length !== permutationsUniqueCount) {
		console.warn(`Something wrong with permutations for N=${length}. Counters: total - ${permutations.length}, unique - ${permutationsUniqueCount}, both total and unique must be - ${permutationsRightCount}`)
	}
	const t2 = performance.now();
	console.log(`found ${permutations.length} permutations in ${t2 - t1} ms`); // TEMP
	return permutations;
}

export function getDistanceBetweenCoordinates(c1, c2) {
	const mult = 1000;
	return Math.sqrt(Math.pow(Math.abs(c1[0] * mult - c2[0] * mult), 2) + Math.pow(Math.abs(c1[1] * mult - c2[1] * mult), 2));
}

export function findMinRouteDistance(availableRouteVariants, coordinates) {
	const t1 = performance.now();
	const getDistance = getDistanceBetweenCoordinates;

	let minDistance = Infinity;
	let minVariant;

	for (let i = 0; i < availableRouteVariants.length; i++) {
		const variant = availableRouteVariants[i];
		const variantDistance = variant
			.map(index => coordinates[index]).reduce((prev, current, i) => {
				const nextPrev = current;
				let distance;

				if (i === 1) {
					distance = getDistance(prev, current);
				} else {
					distance = prev.distance + getDistance(prev.prev, current);
				}

				if (i < variant.length - 1) {
					return {
						distance: distance,
						prev: nextPrev,
					};
				} else {
					return distance;
				}
			});

		if (variantDistance < minDistance) {
			minDistance = variantDistance;
			minVariant = variant;
		}
	}

	const t2 = performance.now();
	console.log(`found min distance for ${availableRouteVariants.length} different route variants in ${t2 - t1} ms`); // TEMP
	return minVariant;
}


