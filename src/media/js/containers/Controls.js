import React from 'react';
import ClearAddressesControl from '../components/ClearAddressesControl';
// import { ClearAddressesControl } from '../components/ClearAddressesControl';

export class Controls extends React.Component {
	constructor(props) {
		super(props);
	}

	onAddressesClear() {
		this.props.onAddressesClear();
	}

	render() {
		return (
			<div className={'controls'}>
				{this.props.addresses.length > 0 ? (
					<div>
						<ClearAddressesControl onClick={this.onAddressesClear.bind(this)} />
					</div>
				) : (
					<></>
				)}
			</div>
		);
	}
}
