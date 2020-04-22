import React from 'react';
import { connect } from 'react-redux';
import store from '../store';
import { addNewStage, setActiveStage } from '../store/actions';

class GameStages extends React.Component {
	goToStage(index) {
		store.dispatch(setActiveStage(index));
	}

	render() {
		const { stages } = this.props;
		const { currentIndex, values } = stages;

		return (
			<div className="stages-nav">
				<div className="stages-nav__buttons">
					<div className="stages-nav__list">
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
					</div>
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
