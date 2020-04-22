/* globals ymaps */

import React from 'react';
import { connect } from 'react-redux';
import Route from './components/Route';
import { getDefaultStagesObject, getStageAddresses } from '../../utils/helpers';
import WebWorker from '../../components/WebWorker';
import { findAllPermutations, findMinRouteDistance } from '../../utils/helpers';
import { MAX_CALC_MIN_DISTANCE_POINTS, USE_COMBINED_CALC, USE_WEBWORKER } from '../../utils/constants';
import LocalStorage from '../../components/LocalStorage';

const STORAGE_KEY_PREFIX = 'map-';
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
		isCalculating: false,
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
							name: addressEntered.replace(`${city} `, ''),
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
		const permutationsArrayLength = geocoded.length - 1;
		const coordinates = geocoded.map(item => item.coordinates);
		let result;

		console.time('sortAddresses'); // TEMP

		const shouldCalcByMinDistance = permutationsArrayLength < MAX_CALC_MIN_DISTANCE_POINTS; // TODO: Подумать, можно ли увеличить это кол-во (за счёт кеширования, мемоизации или ещё чего-нибудь.
		if (calcVariant === availableCalcVariants[0] && !shouldCalcByMinDistance) {
			console.warn(`Current version doesn't support calc by min route distance for more than ${MAX_CALC_MIN_DISTANCE_POINTS} points.`);
		}

		if (calcVariant === availableCalcVariants[0] && shouldCalcByMinDistance) {
			let permutations;
			let routeByMinDistance;

			const storageKey = STORAGE_KEY_PREFIX + 'sort';
			const storageValue = LocalStorage.getItem(storageKey) || [];
			const coordinatesKey = JSON.stringify(coordinates);
			const calcFromStorage = storageValue.filter(item => item.coordinates === coordinatesKey)[0];
			if (calcFromStorage) {
				routeByMinDistance = calcFromStorage.routeByMinDistance;
			} else {
				if (this._calcTimeout) {
					clearTimeout(this._calcTimeout);
				}
				this._calcTimeout = setTimeout(() => {
					this.setState({
						isCalculating: true,
					});
				}, 200);

				if (USE_WEBWORKER && USE_COMBINED_CALC) {
					const workerCalcOptions = {
						type: 'combinedRouteCalc',
						value: {
							coordinates,
						},
					};

					const minRouteDistanceFromWorker = await WebWorker.calculate(workerCalcOptions);
					if (minRouteDistanceFromWorker) {
						routeByMinDistance = minRouteDistanceFromWorker;
					} else {
						permutations = findAllPermutations(permutationsArrayLength);
						const availableRouteVariants = permutations.map(el => [0].concat(el));
						routeByMinDistance = findMinRouteDistance(availableRouteVariants, coordinates);
					}
				} else {
					const workerCalcOptionsPermutations = {
						type: 'permutations',
						value: permutationsArrayLength,
					};

					if (USE_WEBWORKER) {
						const permutationsFromWorker = await WebWorker.calculate(workerCalcOptionsPermutations);
						permutations = permutationsFromWorker && permutationsFromWorker.length ? permutationsFromWorker : findAllPermutations(permutationsArrayLength);
					} else {
						permutations = findAllPermutations(permutationsArrayLength);
					}

					const availableRouteVariants = permutations.map(el => [0].concat(el));

					if (USE_WEBWORKER) {
						const workerCalcOptionsDistance = {
							type: 'minRouteDistance',
							value: {
								routeVariants: availableRouteVariants,
								coordinates,
							},
						};

						const minRouteDistanceFromWorker = await WebWorker.calculate(workerCalcOptionsDistance);
						routeByMinDistance = minRouteDistanceFromWorker ? minRouteDistanceFromWorker : findMinRouteDistance(availableRouteVariants, coordinates);
					} else {
						routeByMinDistance = findMinRouteDistance(availableRouteVariants, coordinates);
					}
				}

				const newStorageObject = {
					coordinates: coordinatesKey,
					routeByMinDistance,
				};
				storageValue.push(newStorageObject);
				LocalStorage.setItem(storageKey, storageValue);

				if (this._calcTimeout) {
					clearTimeout(this._calcTimeout);
				}
				this.setState({
					isCalculating: false,
				});
			}

			const sorted = routeByMinDistance.map(index => geocoded[index]);
			result = sorted;
		} else {
			const query	= ymaps.geoQuery(geoObjects.slice(1)).sortByDistance(geoObjects[0]);
			await query.then(() => {
				const firstAddressObject = this.getRecognizedAddress('geoObject', geoObjects[0]);
				const otherAddressObjects = [];
				query.each(r => otherAddressObjects.push(this.getRecognizedAddress('geoObject', r)));

				const sorted = [firstAddressObject].concat(otherAddressObjects);
				result = sorted;
			});
		}

		console.timeEnd('sortAddresses');
		return result;
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
		const { routes, navigationLinks, isCalculating } = this.state;

		return (
			<div>
				<div id="map" className={`map ${isCalculating ? '_calculating' : ''}`}>
					<div className="map__spinner-wrapper">
						<div className="map__spinner" />
					</div>
				</div>

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

				{!isCalculating && navigationLinks && navigationLinks.variant1 && navigationLinks.variant2 &&
					<div className="description">
						<div>
							<a href={navigationLinks.variant1} target="_blank" rel="nofollow noopener noreferrer">Общая навигация (вариант 1)</a>
						</div>
						<div>
							<a href={navigationLinks.variant2} target="_blank" rel="nofollow noopener noreferrer">Общая навигация (вариант 2)</a>
						</div>
					</div>
				}

				{!isCalculating && routes.map((routeData, index) => {
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
