import * as React from 'react';

export const FieldBlock = props => (
	<div className="input-block">
		<small data-order-entered />
		<input type="text" onChange={event => props.onChange(event)} value={props.value || ''} />
		<button data-clear-input tabIndex="-1">
			x
		</button>
	</div>
);
