import React from 'react';
import { getPrettyDuration } from '../../../utils/helpers';

class RouteStep extends React.Component {
	render() {
		const {params} = this.props;
		const {
			mapCenter,
			mapZoom,
			coordinates,
			addresses,
			distance,
			duration,
		} = params;

		const pathHrefParts = [];

		pathHrefParts.push(`z=${mapZoom}`);
		pathHrefParts.push(`ll=` + mapCenter.slice(0).reverse().join(','));
		pathHrefParts.push(`l=map`);
		pathHrefParts.push('rtext=' + coordinates[0].join(',') + '~' + coordinates[coordinates.length - 1].join(','));
		pathHrefParts.push(`rtn=0`);
		pathHrefParts.push(`rtt=pd`);
		pathHrefParts.push(`rtm=atm`);
		pathHrefParts.push(`origin=jsapi_2_1_72`);
		pathHrefParts.push(`from=api-maps`);
		pathHrefParts.push(`mode=routes`);

		const pathHref = `https://yandex.ru/maps/?${pathHrefParts.join('&')}`;

		const pathAddressStart = addresses.start;
		const pathAddressEnd = addresses.end;

		return (
			<div style={{margin: '20px 0'}}>
				<div>
					<i>{pathAddressStart.name} ({pathAddressStart.orderEntered}) → {pathAddressEnd.name} ({pathAddressEnd.orderEntered})</i>
				</div>
				<div>
					<i>Длина участка: {distance.text}</i>
				</div>
				<div>
					<i>Длительность участка: {getPrettyDuration(duration.value)}</i>
				</div>
				<div>
					<i><a href={pathHref} target="_blank" rel="nofollow noopener noreferrer">Навигация по участку</a></i>
				</div>
			</div>
		);
	}
}

export default RouteStep;
