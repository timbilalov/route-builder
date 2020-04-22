import React from 'react';
import store from '../store';
import { addNewStage, clearAddresses, removeStage } from '../store/actions';
import { connect } from 'react-redux';
import { getStageAddresses } from '../utils/helpers';

class Controls extends React.Component {
	clearAddresses() {
		store.dispatch(clearAddresses());
	}

	removeStage() {
		const { stages } = this.props;
		store.dispatch(removeStage(stages.currentIndex));
	}

	addNewStage() {
		store.dispatch(addNewStage());
	}

	render() {
		const { stages } = this.props;
		const { values } = stages;
		const stagesCount = values.length;
		const lastStageValue = values[stagesCount - 1];
		const lastStageAddresses = lastStageValue.addresses;
		const currentStageAddresses = getStageAddresses(stages);

		return (
			<div className="fields-controls">
				<div className="fields-controls__section">
					<button
						onClick={() => this.clearAddresses()}
						className={`button _outlined ${currentStageAddresses.length === 0 ? '_disabled' : ''}`}
					>
						Очистить все поля
					</button>
				</div>
				<div className="fields-controls__section">
					<button
						onClick={() => this.removeStage()}
						className={`button _outlined ${stagesCount <= 1 ? '_disabled' : ''}`}
					>
						Удалить этап
					</button>
				</div>
				<div className="fields-controls__section">
					<button
						onClick={() => this.addNewStage()}
						className={`button ${lastStageAddresses.length < 2 ? '_outlined _disabled' : ''}`}
					>
						Cледующий этап
					</button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = function(state) {
	return {
		stages: state.stages,
	};
};

export default connect(mapStateToProps)(Controls);
