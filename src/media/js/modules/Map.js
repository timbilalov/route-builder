/* globals ymaps */

function Map() {
	ymaps.ready(function() {
		var myMap = new ymaps.Map('map', {
			center: [55.753994, 37.622093],
			zoom: 9,
			controls: [],
		});

		var multiRoute = new ymaps.multiRouter.MultiRoute(
			{
				referencePoints: ['метро Парк Культуры', 'метро Смоленская', 'метро Арбатская'],
				params: {
					// Установим вторую точку маршрута ('метро Смоленская')
					// в качестве транзитной.
					viaIndexes: [1],
				},
			},
			{
				boundsAutoApply: true,
			}
		);

		// Подпишемся на событие готовности мультимаршрута.
		multiRoute.model.events.add('requestsuccess', function() {
			// Коллекция транзитных точек маршрута.
			var viaPoints = multiRoute.getViaPoints();
			// Проход по коллекции транзитных точек.
			viaPoints.each(function(point) {
				// Для каждой транзитной точки зададим ее отображение.
				point.options.set({
					iconRadius: 7,
					iconFillColor: '#000088',
					// Внешний вид транзитной точки для активного маршрута.
					activeIconFillColor: '#E63E92',
				});
			});
		});

		// Добавление маршрута на карту.
		myMap.geoObjects.add(multiRoute);
	});
}

Map.prototype = {};

const instance = new Map();
module.exports = instance;
