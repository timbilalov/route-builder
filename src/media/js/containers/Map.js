import React from 'react';

export class Map extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <div>Map. Addresses: {this.props.addresses.length}</div>;
	}
}
