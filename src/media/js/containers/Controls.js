import React from 'react';
import ClearAddressesControl from '../components/ClearAddressesControl';

class Controls extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="controls">
				{this.props.addresses.length > 0 ? (
					<div>
						<ClearAddressesControl onClick={this.props.onAddressesClear} />
					</div>
				) : (
					<></>
				)}
			</div>
		);
	}
}

Controls.defaultProps = {
	onAddressesClear: () => {},
};

export default Controls;
