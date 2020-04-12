import React from 'react';
import store from '../store';
import { clearAddresses, removeStage } from '../store/actions';
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

	render() {
		const { stages } = this.props;
		const addresses = getStageAddresses(stages);

		return (
			<div className="controls">
				{addresses.length > 0 && (
					<button
						onClick={() => this.clearAddresses()}
						className="button"
					>
						Очистить все поля
					</button>
				)}
				{stages.values.length > 1 && (
					<button
						onClick={() => this.removeStage()}
						className="button"
					>
						Удалить этап
					</button>
				)}
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
