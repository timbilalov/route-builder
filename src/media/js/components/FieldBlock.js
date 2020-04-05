import React from 'react';
import Utils from 'utils/Utils';

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
		}, 1000);
	}

	render() {
		return (
			<div className="field-block">
				<div className="field-block__container">
					<small
						className="field-block__number-entered"
					>
						{this.props.order}
					</small>
					<input
						type="text"
						onChange={event => this.onChange(event.target.value)}
						value={this.state.value}
						ref="input"
						className="field-block__input"
					/>
					<button
						onClick={() => this.props.onRemoveButtonClick(this.refs.input.value)}
						tabIndex="-1"
						className="field-block__button button _outlined"
					>
						×
					</button>
				</div>
			</div>
		);
	}
}

export default FieldBlock;
