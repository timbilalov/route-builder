/* globals ymaps */

// NOTE:
// https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/geoQuery-docpage/
// https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute-docpage/
// https://tech.yandex.ru/maps/jsbox/2.1/multiroute_data_access
// https://tech.yandex.ru/yandex-apps-launch/navigator/doc/concepts/navigator-url-params-docpage/
function Map() {
	ymaps.ready(function() {
		var myMap = new ymaps.Map('map', {
			center: [55.753994, 37.622093],
			zoom: 9,
			controls: [],
		});

		let pointsOriginal = [
			'метро Выхино',
			'метро Жулебино,',
			'метро Орехово',
			'метро Домодедовская',
		];

		let initMultiRoute = points => {
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
			multiRoute.model.events.add('requestsuccess', function() {
				let allRoutes = multiRoute.model.getRoutes();

				for (let i = 0; i < allRoutes.length; i++) {
					let route = allRoutes[i];
					let routePaths = route.getPaths();
					console.log('Длина маршрута', route.properties.get('distance').text);
					console.log('Длительность маршрута', route.properties.get('duration').text);
					console.log(`Маршрут состоит из ${routePaths.length} участков`);

					for (let j = 0; j < routePaths.length; j++) {
						let path = routePaths[j];

						console.log('Длина участка', path.properties.get('distance').text);
						console.log('Длительность участка', path.properties.get('duration').text);
					}
				}
			});

			// Добавление маршрута на карту.
			myMap.geoObjects.add(multiRoute);
		};

		// TEMP
		let res1 = ymaps.geoQuery(ymaps.geocode(pointsOriginal[0]));
		let res2 = ymaps.geoQuery(ymaps.geocode(pointsOriginal[1]));
		let res3 = ymaps.geoQuery(ymaps.geocode(pointsOriginal[2]));
		let res4 = ymaps.geoQuery(ymaps.geocode(pointsOriginal[3]));
		let count = 0;

		res1.then(() => {
			console.log(pointsOriginal[0], res1._objects[0].geometry._coordinates);
			count++;
			if (count === 4) {
				complete();
			}
		});
		res2.then(() => {
			console.log(pointsOriginal[1], res2._objects[0].geometry._coordinates);
			count++;
			if (count === 4) {
				complete();
			}
		});
		res3.then(() => {
			console.log(pointsOriginal[2], res3._objects[0].geometry._coordinates);
			count++;
			if (count === 4) {
				complete();
			}
		});
		res4.then(() => {
			console.log(pointsOriginal[3], res4._objects[0].geometry._coordinates);
			count++;
			if (count === 4) {
				complete();
			}
		});

		let complete = () => {
			let res5 = ymaps.geoQuery([res1._objects[0], res2._objects[0], res3._objects[0], res4._objects[0]]).sortByDistance(res2._objects[0]);
			let sorted = res5._objects.slice(0).map(el => el.geometry._coordinates);
			console.log('sorted', sorted);
			initMultiRoute(sorted);
		};
	});
}

Map.prototype = {};

const instance = new Map();
module.exports = instance;
