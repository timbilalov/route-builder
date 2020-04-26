import React from 'react';
import store from '../store';
import { addNewStage, clearAddresses, removeStage } from '../store/actions';
import { connect } from 'react-redux';
import { getStageAddresses } from '../utils/helpers';
import LocalStorage from '../components/LocalStorage';
import { EXPORT_HREF_PARAM_NAME } from '../utils/constants';

const HINT_DEFAULT_DURATION = 2000;

class Controls extends React.Component {
	state = {
		isHintVisible: false,
	};

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

	async makeExportUrl() {
		const encodedString = LocalStorage.export(['city', 'stages']);

		let urlToShare = window.location.href;
		const hash = window.location.hash;
		urlToShare = urlToShare.replace(hash, '');
		urlToShare += `#${EXPORT_HREF_PARAM_NAME}=${encodedString}`;

		const promise = new Promise(resolve => {
			navigator.clipboard.writeText(urlToShare).then(function() {
				resolve();
			});
		});

		await promise;

		this.setState({
			isHintVisible: true,
		});

		setTimeout(() => {
			this.setState({
				isHintVisible: false,
			});
		}, HINT_DEFAULT_DURATION);
	}

	render() {
		const { isHintVisible } = this.state;
		const { stages } = this.props;
		const { values } = stages;
		const stagesCount = values.length;
		const lastStageValue = values[stagesCount - 1];
		const lastStageAddresses = lastStageValue.addresses;
		const currentStageAddresses = getStageAddresses(stages);

		return (
			<div className="fields-controls">
				<div className="fields-controls__section _export">
					<button
						onClick={() => this.makeExportUrl()}
						className={`button _outlined ${currentStageAddresses.length || stagesCount > 1 ? '' : '_disabled'}`}
					>
						Экспорт
					</button>

					<span className={`fields-controls__hint ${isHintVisible ? '_active' : ''}`}>Ссылка скопирована в буфер</span>
				</div>
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
