import React from 'react';

export class FieldBlock extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		// TODO: Добавить debouncer для процесса ввода адреса, чтобы обновление стейта (и всех компонентов) не было таким люто частым.
		return (
			<div className="input-block">
				<small data-order-entered>{this.props.order}</small>
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
