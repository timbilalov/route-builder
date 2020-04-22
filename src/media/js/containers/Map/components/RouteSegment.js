import React from 'react';
import { getPrettyDuration } from '../../../utils/helpers';

class RouteSegment extends React.Component {
	render() {
		const { params } = this.props;
		const {
			coordinates,
			addresses,
			distance,
		} = params;

		const pathHrefParts = [];

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
			<div className="route-segment">
				<div className="route-segment__head">
					<div className="route-segment__head-level _level1">
						<span className="route-segment__head-elem">
							<span className="number-entered">{pathAddressStart.orderEntered}</span>
						</span>
						<span className="route-segment__head-elem">
							{pathAddressStart.name}
						</span>
					</div>
					<div className="route-segment__head-level _level2">
						<span className="route-segment__head-elem">
							<span className="number-entered">{pathAddressEnd.orderEntered}</span>
						</span>
						<span className="route-segment__head-elem">
							{pathAddressEnd.name}
						</span>
					</div>
				</div>
				<div className="route-segment__details">
					<span className="route-segment__details-item">
						<a href={pathHref} target="_blank" rel="nofollow noopener noreferrer">Навигация по участку</a>
					</span>
					<span className="route-segment__details-item">
						{distance.text}
					</span>
					<span className="route-segment__details-item">
						{getPrettyDuration(distance.value, undefined, false)}
					</span>
				</div>
			</div>
		);
	}
}

export default RouteSegment;
