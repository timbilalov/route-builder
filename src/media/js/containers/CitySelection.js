import React from 'react';
import { connect } from 'react-redux';
import Utils from 'utils/Utils';
import store from '../store';
import { setCity } from '../store/actions';
import { DEFAULT_INPUT_DEBOUNCE_TIME } from '../utils/constants';

class CitySelection extends React.Component {
	state = {
		value: this.props.city,
	};

	static defaultProps = {
		city: '',
	};

	onChange(value) {
		this.setState({
			value,
		});

		this.onChangeDebounced(value);
	}

	componentDidMount() {
		this.onChangeDebounced = Utils.debounce(value => {
			store.dispatch(setCity(value))
		}, DEFAULT_INPUT_DEBOUNCE_TIME);
	}

	render() {
		return (
			<div className="field-block">
				<input
					type="text"
					className="input"
					placeholder="Город"
					onChange={event => this.onChange(event.target.value)}
					value={this.state.value}
				/>
			</div>
		);
	}
}

const mapStateToProps = function(state) {
	return {
		city: state.city,
	};
};

export default connect(mapStateToProps)(CitySelection);

// export default CitySelection;
