/* globals ymaps */

import React from 'react';
import { connect } from 'react-redux';
import Route from './components/Route';

class Map extends React.Component {
	state = {
		navigationLinks: {
			variant1: false,
			variant2: false,
		},
		routes: [],
	};

	addressesCache = {
		lastCalculated: [],
		recognized: [],
	};

	mapInitialOptions = {
		center: [55.753994, 37.622093],
		zoom: 9,
	};

	static defaultProps = {
		addresses: [],
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

	async geocodeAddresses(addresses = this.props.addresses) {
		this.clearMap();

		if (addresses.length < 2) {
			return;
		}

		const promisesArray = [];

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
							coords: geoObject.geometry.getCoordinates(),
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

	async sortAddresses(geocoded) {
		const geoObjects = geocoded.map(item => item.geoObject);

		return new Promise(resolve => {
			const query	= ymaps.geoQuery(geoObjects.slice(1)).sortByDistance(geoObjects[0]);

			query.then(() => {
				const firstAddressObject = this.getRecognizedAddress('geoObject', geoObjects[0]);
				const otherAddressObjects = [];
				query.each(r => otherAddressObjects.push(this.getRecognizedAddress('geoObject', r)));
				const sorted = [firstAddressObject].concat(otherAddressObjects);

				resolve(sorted);
			});
		});
	}

	clearMap() {
		this.setState({
			navigationLinks: {
				variant1: false,
				variant2: false,
			},
		});
		this.ymap && this.ymap.geoObjects.removeAll();
	}

	buildMultiRoute(sorted) {
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

		this.ymap.geoObjects.add(multiRoute);
	}

	getNavigationLinks(sorted) {
		const coordinates = Array.from(sorted).map(item => item.coords);

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

	async update() {
		const { addresses } = this.props;
		if (JSON.stringify(addresses) === JSON.stringify(this.addressesCache.lastCalculated)) {
			return;
		}
		this.addressesCache.lastCalculated = Array.from(addresses);

		const geocoded = await this.geocodeAddresses(addresses);
		console.log('geocoded', geocoded);
		const sorted = await this.sortAddresses(geocoded);
		console.log('sorted', sorted);

		this.buildMultiRoute(sorted);
		console.log('multiroute builded', sorted);
	}

	componentDidUpdate() {
		this.update();
	}

	render() {
		const { routes, navigationLinks } = this.state;

		return (
			<div>
				<div id="map" className="map" />
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
		addresses: state.addresses,
	};
};

export default connect(mapStateToProps)(Map);
