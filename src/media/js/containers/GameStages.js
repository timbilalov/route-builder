import React from 'react';
import { connect } from 'react-redux';
import store from '../store';
import { addNewStage, setActiveStage } from '../store/actions';

class GameStages extends React.Component {
	goToStage(index) {
		store.dispatch(setActiveStage(index));
	}

	addNewStage() {
		store.dispatch(addNewStage());
	}

	render() {
		const { stages } = this.props;
		const { currentIndex, values } = stages;
		const stagesCount = values.length;
		const lastStageValue = values[stagesCount - 1];
		const lastStageAddresses = lastStageValue.addresses;

		return (
			<div className="stages-nav">
				<div className="stages-nav__buttons">
					{values.map((value, index) => {
						return (
							<button
								className={`stages-nav__button ${index === currentIndex ? '_active' : ''}`}
								key={index}
								onClick={() => this.goToStage(index)}
							>
								Этап {index + 1}
							</button>
						);
					})}
					<button
						className={`stages-nav__button ${lastStageAddresses.length < 2 ? '_disabled' : ''}`}
						onClick={() => this.addNewStage()}
					>
						+ следующий этап
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

export default connect(mapStateToProps)(GameStages);
