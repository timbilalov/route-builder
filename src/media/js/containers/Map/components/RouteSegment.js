import React from 'react';
import { getPrettyDuration, getStageCompletedSegments } from '../../../utils/helpers';
import store from '../../../store';
import { setCompletedSegment, unsetCompletedSegment } from '../../../store/actions';
import { connect } from 'react-redux';

class RouteSegment extends React.Component {
	completeSegment() {
		const { params } = this.props;
		const { index } = params;

		store.dispatch(setCompletedSegment(index));
	}

	uncompleteSegment() {
		const { params } = this.props;
		const { index } = params;

		store.dispatch(unsetCompletedSegment(index));
	}

	toggleCompleted() {
		const isCompleted = this.checkIsCompleted();

		if (isCompleted) {
			this.uncompleteSegment();
		} else {
			this.completeSegment();
		}
	}

	checkIsCompleted() {
		const { params, stages } = this.props;
		const { index } = params;
		const completedSegments = getStageCompletedSegments(stages);

		return completedSegments.includes(index);
	}

	render() {
		const { params } = this.props;
		const { coordinates, addresses, distance } = params;
		const isCompleted = this.checkIsCompleted();
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
			<div className={`route-segment ${isCompleted ? '_completed' : ''}`}>
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
				<button
					onClick={() => this.toggleCompleted()}
					className={`route-segment__complete-button button _small ${isCompleted ? '_outlined' : ''}`}
				>
					✓
				</button>
			</div>
		);
	}
}

const mapStateToProps = function(state) {
	return {
		stages: state.stages,
	};
};

export default connect(mapStateToProps)(RouteSegment);
