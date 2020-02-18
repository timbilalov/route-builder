import React from 'react';

class FieldBlock extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: this.props.value || '',
		};
	}

	onChange(event) {
		const value = event.target.value || this.props.value;

		this.setState({
			value,
		});

		this.props.onChange(event);
	}

	render() {
		return (
			<div className="input-block">
				<small data-order-entered>{this.props.order}</small>
				<input type="text" onChange={event => this.onChange(event)} value={this.state.value} ref="input" />
				<button onClick={() => this.props.onRemoveButtonClick(this.refs.input.value)} tabIndex="-1">
					x
				</button>
			</div>
		);
	}
}

FieldBlock.defaultProps = {
	onRemoveButtonClick: () => {},
	onChange: () => {},
	order: '',
};

export default FieldBlock;
