import React from 'react';
import FieldsList from './containers/FieldsList';
import Map from './containers/Map/Map';
import Controls from './containers/Controls';
import { connect } from 'react-redux';
import LocalStorage from './components/LocalStorage';
import { ADDRESSES_STORAGE_KEY } from './utils/constants';

class App extends React.Component {
	static defaultProps = {
		addresses: [],
	};

	componentDidUpdate() {
		const { addresses } = this.props;
		LocalStorage.setItem(ADDRESSES_STORAGE_KEY, addresses);
	}

	render() {
		return (
			<>
				<FieldsList />
				<Controls />
				<Map />
			</>
		);
	}
}

const mapStateToProps = function(state) {
	return {
		addresses: state.addresses,
	};
};

export default connect(mapStateToProps)(App);
