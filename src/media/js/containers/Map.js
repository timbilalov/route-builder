/* globals ymaps */

import React from 'react';

const DURATION_MILTIPLIER = 1 / 2;

function getPrettyDuration(durationValueRaw) {
	let duration = durationValueRaw * DURATION_MILTIPLIER;
	return '~ ' + Math.round(duration / 60) + ' мин';
}

export class Map extends React.Component {
	constructor(props) {
		super(props);

		$.getScript('https://api-maps.yandex.ru/2.1/?apikey=b1838d93-47fb-47bb-b837-89ef1dad64f7&lang=ru_RU', () =>
			this.init()
		);
	}

	init() {
		this.$description = $('[data-description]');
		this.$linkToApp = $('[data-link-to-app]');

		this.mapCenterCoordinates = [55.753994, 37.622093];
		this.mapZoom = 9;

		ymaps.ready(() => {
			this.ymap = new ymaps.Map('map', {
				center: this.mapCenterCoordinates,
				zoom: this.mapZoom,
				controls: [],
			});

			this.update();
		});
	}

	update() {
		let points = this.props.addresses.slice(0);

		this._clearMap();
		this.recognizedAddresses = [];

		if (points.length < 2) {
			return;
		}

		let objects = [];
		let count = points.length;
		for (let i = 0; i < points.length; i++) {
			let query = ymaps.geoQuery(ymaps.geocode(points[i])).then(() => {
				objects[i] = query._objects[0];

				this.recognizedAddresses.push({
					name: points[i],
					orderEntered: i + 1,
					coords: query._objects[0].geometry._coordinates,
				});

				if (--count <= 0) {
					complete();
				}
			});
		}

		let complete = () => {
			if (!objects.length) {
				console.error(`Can't find objects`);
				return;
			}
			let query = ymaps
				.geoQuery(objects.slice(1))
				.sortByDistance(objects[0])
				.then(() => {
					let objectsSorted = [objects[0]].concat(query._objects.slice(0));
					this._initMultiRoute(objectsSorted);
				});
		};
	}

	_getAddressByCoords(coords) {
		if (!this.recognizedAddresses || !this.recognizedAddresses.length) {
			return false;
		}

		let res = false;
		let tolerance = 0.0004;
		for (let i = 0; i < this.recognizedAddresses.length; i++) {
			let address = this.recognizedAddresses[i];
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

	_clearMap() {
		this.$description.html('');
		this.$linkToApp.attr('href', '');
		this.ymap && this.ymap.geoObjects.removeAll();
	}

	_initMultiRoute(points) {
		let orderSortedArr = [];
		points.forEach(p => {
			let address = this._getAddressByCoords(p.geometry._coordinates);
			orderSortedArr.push(address.orderEntered);
		});

		var multiRoute = new ymaps.multiRouter.MultiRoute(
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
			for (let i = 0; i < this.recognizedAddresses.length; i++) {
				let wayPoint = multiRoute.getWayPoints().get(i);

				ymaps.geoObject.addon.balloon.get(wayPoint);
				let wayPointCoords = wayPoint.geometry._coordinates;
				let wayPointName = '' + this._getAddressByCoords(wayPointCoords).orderEntered;
				let wayPointAddress = this._getAddressByCoords(wayPointCoords).name;

				wayPoint.options.set({
					preset: 'islands#darkGreenCircleIcon',
					iconContentLayout: ymaps.templateLayoutFactory.createClass(wayPointName),
					balloonContentLayout: ymaps.templateLayoutFactory.createClass(wayPointAddress),
				});
			}

			let allRoutes = multiRoute.model.getRoutes();
			let routesText = [];

			for (let i = 0; i < allRoutes.length; i++) {
				let route = allRoutes[i];
				let routePaths = route.getPaths();
				let text = [];
				text.push(`<br><b>Вариант маршрута №${i + 1}</b>`);
				text.push(`Порядок адресов: ${orderSortedArr.join(', ')}`);
				text.push(`Длина маршрута: ${route.properties.get('distance').text}`);
				text.push(`Длительность маршрута: ${getPrettyDuration(route.properties.get('duration').value)}`);
				text.push(`Маршрут состоит из ${routePaths.length} участков:`);

				for (let j = 0; j < routePaths.length; j++) {
					let path = routePaths[j];

					let pathCoords = path.properties.get('coordinates');
					let pathHref = '';
					let pathHrefParts = [];
					pathHrefParts.push(`z=${this.mapZoom}`);
					pathHrefParts.push(
						`ll=` +
							this.mapCenterCoordinates
								.slice(0)
								.reverse()
								.join(',')
					);
					pathHrefParts.push(`l=map`);
					pathHrefParts.push(
						'rtext=' + pathCoords[0].join(',') + '~' + pathCoords[pathCoords.length - 1].join(',')
					);
					pathHrefParts.push(`rtn=0`);
					pathHrefParts.push(`rtt=pd`);
					pathHrefParts.push(`rtm=atm`);
					pathHrefParts.push(`origin=jsapi_2_1_72`);
					pathHrefParts.push(`from=api-maps`);
					pathHrefParts.push(`mode=routes`);

					pathHref = `https://yandex.ru/maps/?${pathHrefParts.join('&')}`;

					let pathAddressStart = this._getAddressByCoords(pathCoords[0]);
					let pathAddressEnd = this._getAddressByCoords(pathCoords[pathCoords.length - 1]);

					text.push(
						`<br><i>${pathAddressStart.name} (${pathAddressStart.orderEntered}) → ${pathAddressEnd.name} (${
							pathAddressEnd.orderEntered
						})</i>`
					);
					text.push(`<i>Длина участка: ${path.properties.get('distance').text}</i>`);
					text.push(
						`<i>Длительность участка: ${getPrettyDuration(path.properties.get('duration').value)}</i>`
					);
					text.push(`<i><a href="${pathHref}" target="_blank" rel="nofollow">Навигация по участку</a></i>`);
				}

				text = text.join('<br>');
				routesText.push(text);
			}

			let resText = routesText.join('<br><br>');
			let coordinates = points.slice(0).map(el => el.geometry._coordinates);

			let hrefParts = [];
			hrefParts.push(`z=${this.mapZoom}`);
			hrefParts.push(
				`ll=` +
					this.mapCenterCoordinates
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
			this.$linkToApp.attr('href', href);
			resText += `<br><br><a href="${href}" target="_blank" rel="nofollow">Общая навигация (вариант 1)</a>`;
			resText += `<br><a href="${href2}" target="_blank" rel="nofollow">Общая навигация (вариант 2)</a>`;
			this.$description.html(resText);
		});

		// Добавление маршрута на карту.
		this.ymap.geoObjects.add(multiRoute);
	}

	componentDidUpdate() {
		this.update();
	}

	render() {
		return (
			<div>
				<div>Map. Addresses: {this.props.addresses.length}</div>
				<div id="map" className="map" />
				<div className="description" data-description />
			</div>
		);
	}
}
