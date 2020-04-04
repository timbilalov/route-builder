import React from 'react';
import RouteStep from './RouteStep';
import { getPrettyDuration } from '../../../utils/helpers';

class Route extends React.Component {
	render() {
		const {data, map} = this.props;
		const {route, num, sorted} = data;
		const orderSortedArr = sorted.map(item => item.orderEntered);
		const mapZoom = map.getZoom();
		const mapCenter = map.getCenter();
		const routePaths = route.getPaths();
		const distance = route.properties.get('distance');
		const duration = route.properties.get('duration');

		return (
			<div>
				<div><b>Вариант маршрута №{num}</b></div>
				<div>Порядок адресов: {orderSortedArr.join(', ')}</div>
				<div>Длина маршрута: {distance.text}</div>
				<div>Длительность маршрута: {getPrettyDuration(duration.value)}</div>
				<div>Маршрут состоит из {routePaths.length} участков:</div>

				{routePaths.map((path, index) => {
					const distance = path.properties.get('distance');
					const duration = path.properties.get('duration');
					const coordinates = path.properties.get('coordinates');
					const addresses = {
						start: sorted[index],
						end: sorted[index + 1],
					};

					const params = {
						index,
						distance,
						duration,
						coordinates,
						addresses,
						mapCenter,
						mapZoom,
					};

					return (
						<RouteStep key={index} params={params} />
					);
				})}
			</div>
		);
	}
}

export default Route;
