/* globals ymaps */

import React from 'react';
import { connect } from 'react-redux';
import Route from './components/Route';

class Map extends React.Component {
	state = {
		descriptionHTML: '',
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

		console.log('cache', Object.assign({}, this.addressesCache));

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

	_getAddressByCoords(coords) {
		const { recognized } = this.addressesCache;

		if (!recognized || !recognized.length) {
			return false;
		}

		let res = false;
		let tolerance = 0.0004;
		for (let i = 0; i < recognized.length; i++) {
			let address = recognized[i];
			let addressCoords = address.coords;
			if (
				Math.abs(addressCoords[0] - coords[0]) <= tolerance &&
				Math.abs(addressCoords[1] - coords[1]) <= tolerance
			) {
				res = address;
			}
		}
		return res;
	}

	clearMap() {
		this.setState({
			descriptionHTML: '',
		});
		this.ymap && this.ymap.geoObjects.removeAll();
	}

	_initMultiRoute(sorted) {
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
			const routes = allRoutes.map((route, index) => {
				return {
					num: index + 1,
					sorted,
					route,
				};
			});

			this.setState({
				routes,
			});

			let resText = '';
			let coordinates = points.slice(0).map(el => el.geometry._coordinates);

			let hrefParts = [];
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

			let hrefParts2 = [];
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

			let resHref = hrefParts.join('&');
			let resHref2 = hrefParts2.join('&');
			let href = `https://yandex.ru/maps/?${resHref}`;
			let href2 = `yandexmaps://build_route_on_map?${resHref2}`;
			resText += `<br><br><a href="${href}" target="_blank" rel="nofollow">Общая навигация (вариант 1)</a>`;
			resText += `<br><a href="${href2}" target="_blank" rel="nofollow">Общая навигация (вариант 2)</a>`;

			this.setState({
				descriptionHTML: resText,
			});
		});

		// Добавление маршрута на карту.
		this.ymap.geoObjects.add(multiRoute);
	}

	componentDidUpdate() {
		this.update();
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

		// TODO
		this._initMultiRoute(sorted);
	}

	render() {
		const {routes} = this.state;

		return (
			<div>
				<div id="map" className="map" />
				<div className="description" dangerouslySetInnerHTML={{__html: this.state.descriptionHTML}}></div>
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
