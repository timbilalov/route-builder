/* globals ymaps */

import React from 'react';
import { connect } from 'react-redux';
import Route from './components/Route';
import { DEFAULT_STAGES } from '../../utils/constants';
import { getDefaultStagesObject, getStageAddresses } from '../../utils/helpers';

const SHOW_DIFFERENT_CALC_VARIANTS = true;

class Map extends React.Component {
	availableCalcVariants = [
		'minRouteDistance',
		'nearestPoint',
	];

	state = {
		navigationLinks: {
			variant1: false,
			variant2: false,
		},
		routes: [],
		calcVariant: this.availableCalcVariants[0],
		isMapClean: true,
	};

	addressesCache = {
		lastCalculated: [],
		city: this.props.city,
		recognized: [],
	};

	mapInitialOptions = {
		center: [55.753994, 37.622093],
		zoom: 9,
	};

	static defaultProps = {
		city: '',
		stages: getDefaultStagesObject(),
	};

	init() {
		const options = this.mapInitialOptions;

		ymaps.ready(() => {
			this.ymap = new ymaps.Map('map', {
				center: options.center,
				zoom: options.zoom,
				controls: [],
			});

			this.update();
		});
	}

	componentDidMount() {
		$.getScript('https://api-maps.yandex.ru/2.1/?apikey=b1838d93-47fb-47bb-b837-89ef1dad64f7&lang=ru_RU', () =>
			this.init()
		);
	}

	getRecognizedAddress(key, value) {
		return this.addressesCache.recognized.filter(item => item[key] === value)[0];
	}

	async geocodeAddresses(addresses) {
		const promisesArray = [];
		const { city } = this.props;
		addresses = addresses.map(address => `${city} ${address}`);

		for (let i = 0; i < addresses.length; i++) {
			const promise = new Promise(resolve => {
				const addressEntered = addresses[i];
				const addressRecognized = this.getRecognizedAddress('name', addressEntered);
				if (addressRecognized) {
					resolve(addressRecognized);
				} else {
					const query = ymaps.geoQuery(ymaps.geocode(addressEntered));

					query.then(() => {
						const geoObject = query.get(0);
						const recognized = {
							name: addressEntered,
							orderEntered: i + 1,
							coordinates: geoObject.geometry.getCoordinates(),
							geoObject,
						};

						this.addressesCache.recognized.push(recognized);
						resolve(recognized);
					});
				}
			});
			promisesArray.push(promise);
		}

		return Promise.all(promisesArray);
	}

	factorial(n) {
		if (n === 1) {
			return 1;
		} else {
			return n * this.factorial(n - 1);
		}
	}

	// https://en.wikipedia.org/wiki/Permutation
	// https://en.wikipedia.org/wiki/Heap%27s_algorithm
	// https://stackoverflow.com/questions/40598891/heaps-algorithm-walk-through
	// http://ruslanledesma.com/2016/06/17/why-does-heap-work.html
	findAllPermutations(length) {
		const permutations = [];
		const permutationsRightCount = this.factorial(length);

		function generate(n, array) {
			array = Array.from(array);

			if (n === 1) {
				permutations.push(array);
			} else {
				for (var i = 0; i < n - 1; i++) {
					generate(n - 1, array);

					if (n % 2 !== 0) {
						const one = array[i];
						const two = array[n - 1];

						array[i] = two;
						array[n - 1] = one;
					} else {
						const first = array[0];
						const second = array[n - 1];

						array[0] = second;
						array[n - 1] = first;
					}
				}

				generate(n - 1, array);
			}
		}

		generate(length, Array.from(new Array(length)).map((el, index) => index + 1));

		// TODO: Сейчас ещё есть кейсы, когда неправильно находит все варианты. Разобраться.
		const permutationsUniqueCount = new Set(permutations.map(el => el.toString())).size;
		if (permutations.length !== permutationsRightCount || permutations.length !== permutationsUniqueCount) {
			console.warn(`Something wrong with permutations for N=${length}. Counters: total - ${permutations.length}, unique - ${permutationsUniqueCount}, both total and unique must be - ${permutationsRightCount}`)
		}
		return permutations;
	}

	getDistanceBetweenCoordinates(c1, c2) {
		const mult = 1000;
		return Math.sqrt(Math.pow(Math.abs(c1[0] * mult - c2[0] * mult), 2) + Math.pow(Math.abs(c1[1] * mult - c2[1] * mult), 2));
	}

	findMinRouteDistance(availableRouteVariants, coordinates) {
		const getDistance = this.getDistanceBetweenCoordinates;

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

		return minVariant;
	}

	onCalcVariantChange(variant) {
		this.setState({
			calcVariant: variant,
		});
		this.update(true);
	}

	async sortAddresses(geocoded) {
		const geoObjects = geocoded.map(item => item.geoObject);
		const { calcVariant } = this.state;
		const { availableCalcVariants } = this;

		return new Promise(resolve => {
			if (calcVariant === availableCalcVariants[0]) {
				const coordinates = geocoded.map(item => item.coordinates);
				const availableRouteVariants = this.findAllPermutations(geocoded.length - 1).map(el => [0].concat(el));
				const routeByMinDistance = this.findMinRouteDistance(availableRouteVariants, coordinates);

				const sorted = routeByMinDistance.map(index => geocoded[index]);
				resolve(sorted);
			} else {
				const query	= ymaps.geoQuery(geoObjects.slice(1)).sortByDistance(geoObjects[0]);
				query.then(() => {
					const firstAddressObject = this.getRecognizedAddress('geoObject', geoObjects[0]);
					const otherAddressObjects = [];
					query.each(r => otherAddressObjects.push(this.getRecognizedAddress('geoObject', r)));

					const sorted = [firstAddressObject].concat(otherAddressObjects);
					resolve(sorted);
				});
			}
		});
	}

	clearMap() {
		const { isMapClean } = this.state;

		if (!this.ymap || isMapClean) {
			return;
		}

		this.setState({
			navigationLinks: {
				variant1: false,
				variant2: false,
			},
			isMapClean: true,
		});

		this.ymap.geoObjects.removeAll();
	}

	async buildMultiRoute(sorted) {
		const points = sorted.map(item => item.geoObject);

		const multiRoute = new ymaps.multiRouter.MultiRoute(
			{
				referencePoints: points,
				params: {
					routingMode: 'pedestrian',
				},
			},
			{
				boundsAutoApply: true,
			}
		);

		// Подписка на событие обновления данных маршрута.
		// Подробнее о событии в справочнике.
		// Обратите внимание, подписка осуществляется для поля model.
		multiRoute.model.events.add('requestsuccess', () => {
			const wayPoints = multiRoute.getWayPoints();
			for (let i = 0; i < points.length; i++) {
				const wayPoint = wayPoints.get(i);
				const addressObject = sorted[i];
				const wayPointName = addressObject.orderEntered.toString();
				const wayPointAddress = addressObject.name;

				wayPoint.options.set({
					preset: 'islands#darkGreenCircleIcon',
					iconContentLayout: ymaps.templateLayoutFactory.createClass(wayPointName),
					balloonContentLayout: ymaps.templateLayoutFactory.createClass(wayPointAddress),
				});

				ymaps.geoObject.addon.balloon.get(wayPoint);
			}

			const allRoutes = multiRoute.model.getRoutes();
			const { href1, href2 } = this.getNavigationLinks(sorted);
			const routes = allRoutes.map((route, index) => {
				return {
					num: index + 1,
					sorted,
					route,
				};
			});

			this.setState({
				routes,
				navigationLinks: {
					variant1: href1,
					variant2: href2,
				},
			});
		});

		await this.ymap.geoObjects.add(multiRoute);
	}

	getNavigationLinks(sorted) {
		const coordinates = Array.from(sorted).map(item => item.coordinates);

		const hrefParts = [];
		hrefParts.push(`z=${this.mapInitialOptions.zoom}`);
		hrefParts.push(
			`ll=` +
			this.mapInitialOptions.center
				.slice(0)
				.reverse()
				.join(',')
		);
		hrefParts.push(`l=map`);
		hrefParts.push('rtext=' + coordinates.map(el => `${el[0]},${el[1]}`).join('~'));
		hrefParts.push(`rtn=0`);
		hrefParts.push(`rtt=pd`);
		hrefParts.push(`rtm=atm`);
		hrefParts.push(`origin=jsapi_2_1_72`);
		hrefParts.push(`from=api-maps`);
		hrefParts.push(`mode=routes`);

		const hrefParts2 = [];
		hrefParts2.push(`lat_from=${coordinates[0][0]}&lon_from=${coordinates[0][1]}`);
		hrefParts2.push(
			`lat_to=${coordinates[coordinates.length - 1][0]}&lon_to=${coordinates[coordinates.length - 1][1]}`
		);
		if (coordinates.length > 2) {
			let coordinatesVia = coordinates.slice(1, coordinates.length - 1);
			for (let j = 0; j < coordinatesVia.length; j++) {
				hrefParts2.push(`lat_via_${j}=${coordinatesVia[j][0]}&lon_via_${j}=${coordinatesVia[j][1]}`);
			}
		}
		hrefParts2.push(`rtt=pd`);

		const href1 = `https://yandex.ru/maps/?${hrefParts.join('&')}`;
		const href2 = `yandexmaps://build_route_on_map?${hrefParts2.join('&')}`;

		return {
			href1,
			href2,
		};
	}

	async update(forced = false) {
		const { stages, city } = this.props;
		const addresses = getStageAddresses(stages);
		let shouldReturn = false;

		if (!this.ymap) {
			shouldReturn = true;
		} else if (addresses.length < 2) {
			shouldReturn = true;
		} else {
			if (forced) {
				shouldReturn = false;
			} else if (JSON.stringify(addresses) === JSON.stringify(this.addressesCache.lastCalculated)) {
				if (city === this.addressesCache.city) {
					shouldReturn = true;
				}
			}
		}

		if (shouldReturn) {
			return;
		}

		this.clearMap();

		this.addressesCache.lastCalculated = Array.from(addresses);
		this.addressesCache.city = city;

		const geocoded = await this.geocodeAddresses(addresses);
		console.log('geocoded', geocoded); // TEMP
		const sorted = await this.sortAddresses(geocoded);
		console.log('sorted', sorted); // TEMP
		await this.buildMultiRoute(sorted);
		console.log('multiroute builded', sorted); // TEMP

		this.setState({
			isMapClean: false,
		});
	}

	componentDidUpdate() {
		this.update();
	}

	render() {
		const { routes, navigationLinks } = this.state;

		return (
			<div>
				<div id="map" className="map" />
				{SHOW_DIFFERENT_CALC_VARIANTS &&
					<div className="map-calc-variants">
						<select
							onChange={event => this.onCalcVariantChange(event.target.value)}
							defaultValue={this.availableCalcVariants[0]}
						>
							{this.availableCalcVariants.map((variant, index) => {
								return (
									<option value={variant} key={index}>{variant}</option>
								);
							})}
						</select>
					</div>
				}
				{navigationLinks && navigationLinks.variant1 && navigationLinks.variant2 &&
					<div className="description">
						<div>
							<a href={navigationLinks.variant1} target="_blank" rel="nofollow noopener noreferrer">Общая навигация (вариант 1)</a>
						</div>
						<div>
							<a href={navigationLinks.variant2} target="_blank" rel="nofollow noopener noreferrer">Общая навигация (вариант 2)</a>
						</div>
					</div>
				}
				{routes.map((routeData, index) => {
					return (
						<Route key={index} data={routeData} map={this.ymap} />
					);
				})}
			</div>
		);
	}
}

const mapStateToProps = function(state) {
	return {
		city: state.city,
		stages: state.stages,
	};
};

export default connect(mapStateToProps)(Map);
