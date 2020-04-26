import React from 'react';
import Utils from 'utils/Utils';
import { DEFAULT_INPUT_DEBOUNCE_TIME } from '../../../utils/constants';

class FieldBlock extends React.Component {
	state = {
		value: this.props.defaultValue,
	};

	static defaultProps = {
		defaultValue: '',
		onRemoveButtonClick: () => {},
		onChange: () => {},
		order: '',
	};

	onChange(value) {
		this.setState({
			value,
		});

		this.onChangeDebounced(value);
	}

	componentDidMount() {
		this.onChangeDebounced = Utils.debounce(value => {
			this.props.onChange(value);
		}, DEFAULT_INPUT_DEBOUNCE_TIME);
	}

	render() {
		const { value } = this.state;

		return (
			<div className="field-block">
				<div className="field-block__container">
					<span
						className="field-block__number-entered number-entered"
					>
						{this.props.order}
					</span>
					<input
						type="text"
						onChange={event => this.onChange(event.target.value)}
						value={value}
						ref="input"
						className="input field-block__input"
					/>
					<button
						onClick={() => this.props.onRemoveButtonClick(this.refs.input.value)}
						tabIndex="-1"
						className={`field-block__button button _outlined ${!value ? '_disabled' : ''}`}
					>
						×
					</button>
				</div>
			</div>
		);
	}
}

export default FieldBlock;
