import React from 'react';
import RouteSegment from './RouteSegment';
import { getPrettyDuration } from '../../../utils/helpers';

class Route extends React.Component {
	render() {
		const { data, map } = this.props;
		const { route, num, sorted } = data;
		const orderSortedArr = sorted.map(item => item.orderEntered);
		const mapZoom = map.getZoom();
		const mapCenter = map.getCenter();
		const routeSegments = route.getPaths();
		const distance = route.properties.get('distance');

		return (
			<div className="route">
				<div><b>Вариант маршрута №{num}</b></div>
				<div>Порядок адресов: {orderSortedArr.join(', ')}</div>
				<div>Длина маршрута: {distance.text}</div>
				<div>Длительность маршрута: {getPrettyDuration(distance.value)}</div>
				<div>Маршрут состоит из {routeSegments.length} участков:</div>

				<div className="route__segments">
					{routeSegments.map((path, index) => {
						const distance = path.properties.get('distance');
						const coordinates = path.properties.get('coordinates');
						const addresses = {
							start: sorted[index],
							end: sorted[index + 1],
						};

						const params = {
							index,
							distance,
							coordinates,
							addresses,
							mapCenter,
							mapZoom,
						};

						return (
							<RouteSegment key={index} params={params} />
						);
					})}
				</div>
			</div>
		);
	}
}

export default Route;
