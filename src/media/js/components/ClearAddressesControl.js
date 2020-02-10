import React from 'react';

export class ClearAddressesControl extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <button onClick={this.props.onClick}>Очистить все поля</button>;
	}
}
