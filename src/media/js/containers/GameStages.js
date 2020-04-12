import React from 'react';
import { connect } from 'react-redux';
import store from '../store';
import { setActiveStage } from '../store/actions';

class GameStages extends React.Component {
	goToStage(index) {
		store.dispatch(setActiveStage(index));
	}

	render() {
		const { stages } = this.props;
		const { currentIndex, values } = stages;

		return (
			<div className="stages-nav">
				<button onClick={() => this.goToStage(currentIndex - 1)}>prev</button>
				{values.map((value, index) => {
					return (
						<button key={index} onClick={() => this.goToStage(index)}>stage {index + 1}</button>
					);
				})}
				<button onClick={() => this.goToStage(currentIndex + 1)}>next</button>
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
