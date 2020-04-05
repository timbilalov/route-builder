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
			<div className="input-block">
				<small data-order-entered>{this.props.order}</small>
				<input
					type="text"
					onChange={event => this.onChange(event.target.value)}
					value={this.state.value}
					ref="input"
				/>
				<button onClick={() => this.props.onRemoveButtonClick(this.refs.input.value)} tabIndex="-1">
					x
				</button>
			</div>
		);
	}
}

export default FieldBlock;
