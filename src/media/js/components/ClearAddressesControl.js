import React from 'react';

function ClearAddressesControl(props) {
	return (
		<button
			onClick={props.onClick}
			className="button"
		>
			Очистить все поля
		</button>
	);
}

ClearAddressesControl.defaultProps = {
	onClick: () => {},
};

export default ClearAddressesControl;
