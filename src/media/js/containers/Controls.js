import React from 'react';
import ClearAddressesControl from '../components/ClearAddressesControl';
import store from '../store';
import { clearAddresses } from '../store/actions';
import { connect } from 'react-redux';

class Controls extends React.Component {
	onAddressesClear() {
		store.dispatch(clearAddresses());
	}

	render() {
		return (
			<div className="controls">
				{this.props.addresses.length > 0 ? (
					<div>
						<ClearAddressesControl onClick={this.onAddressesClear} />
					</div>
				) : (
					<></>
				)}
			</div>
		);
	}
}

const mapStateToProps = function(state) {
	return {
		addresses: state.addresses,
	};
};

export default connect(mapStateToProps)(Controls);
