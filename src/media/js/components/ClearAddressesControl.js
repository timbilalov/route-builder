import React from 'react';

function ClearAddressesControl(props) {
	return <button onClick={props.onClick}>Очистить все поля</button>;
}

ClearAddressesControl.defaultProps = {
	onClick: () => {},
};

export default ClearAddressesControl;
