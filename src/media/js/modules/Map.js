/* globals ymaps */

const dom = require('../utils/DOM');

// NOTE:
// https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/geoQuery-docpage/
// https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute-docpage/
// https://tech.yandex.ru/maps/jsbox/2.1/multiroute_data_access
// https://tech.yandex.ru/yandex-apps-launch/navigator/doc/concepts/navigator-url-params-docpage/
function Map() {
	this.$inputs = dom.$body.find('.inputs input');
	this.$description = dom.$body.find('[data-description]');
	this.$linkToApp = dom.$body.find('[data-link-to-app]');

	ymaps.ready(() => {
		this.ymap = new ymaps.Map('map', {
			center: [55.753994, 37.622093],
			zoom: 9,
			controls: [],
		});
		console.log('map created');
	});

	dom.$body.on('click', '[data-update-map]', () => this.update());
	this.$inputs.on('change', () => this.update());
	dom.$body.on('click', '[data-clear-inputs]', () => this._clearInputs());
}

Map.prototype = {
	update() {
		console.log('update fired');
		let points = [];

		this._clearMap();
		this.$inputs.each((index, elem) => !!elem.value && points.push(elem.value));

		if (points.length < 2) {
			return;
		}

		let objects = [];
		let count = points.length;
		for (let i = 0; i < points.length; i++) {
			let query = ymaps.geoQuery(ymaps.geocode(points[i])).then(() => {
				objects[i] = query._objects[0];
				if (--count <= 0) {
					complete();
				}
			});
		}

		let complete = () => {
			console.log('all requests completed');

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
	},

	_clearMap() {
		this.$description.html('');
		this.$linkToApp.attr('href', '');
		this.ymap && this.ymap.geoObjects.removeAll();
		console.log('map cleared');
	},

	_clearInputs() {
		this.$inputs.val('');
		console.log('inputs cleared');
	},

	_initMultiRoute(points) {
		console.log('_initMultiRoute', points);

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
			let allRoutes = multiRoute.model.getRoutes();
			let routesText = [];

			for (let i = 0; i < allRoutes.length; i++) {
				let route = allRoutes[i];
				let routePaths = route.getPaths();
				let text = [];
				text.push(`Длина маршрута: ${route.properties.get('distance').text}`);
				text.push(`Длительность маршрута: ${route.properties.get('duration').text}`);
				text.push(`Маршрут состоит из ${routePaths.length} участков:`);

				for (let j = 0; j < routePaths.length; j++) {
					let path = routePaths[j];

					text.push(`Длина участка: ${path.properties.get('distance').text}`);
					text.push(`Длительность участка: ${path.properties.get('duration').text}`);
				}

				text = text.join('<br>');
				routesText.push(text);
			}

			let resText = routesText.join('<br><br>');
			let coordinates = points.slice(0).map(el => el.geometry._coordinates);
			let hrefParts = [];

			hrefParts.push(`lat_from=${coordinates[0][0]}&lon_from=${coordinates[0][1]}`);
			hrefParts.push(
				`lat_to=${coordinates[coordinates.length - 1][0]}&lon_to=${coordinates[coordinates.length - 1][1]}`
			);
			if (coordinates.length > 2) {
				let coordinatesVia = coordinates.slice(1, coordinates.length - 1);
				for (let j = 0; j < coordinatesVia.length; j++) {
					hrefParts.push(`lat_via_${j}=${coordinatesVia[j][0]}&lon_via_${j}=${coordinatesVia[j][1]}`);
				}
			}

			hrefParts.push(`rtt=pd`);
			let resHref = hrefParts.join('&');
			let href = `yandexmaps://build_route_on_map?${resHref}`;
			this.$linkToApp.attr('href', href);
			resText += `<br><br>link href: ${href}`;
			this.$description.html(resText);
		});

		// Добавление маршрута на карту.
		this.ymap.geoObjects.add(multiRoute);
	},
};

const instance = new Map();
module.exports = instance;
