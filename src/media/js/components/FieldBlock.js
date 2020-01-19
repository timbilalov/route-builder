import React from 'react';

export class FieldBlock extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="input-block">
				<small data-order-entered />
				<input
					type="text"
					onChange={event => this.props.onChange(event)}
					value={this.props.value || ''}
					ref="input"
				/>
				<button onClick={() => this.props.onRemoveButtonClick(this.refs.input)} tabIndex="-1">
					x
				</button>
			</div>
		);
	}
}
