import React from 'react';

function SvgIcon(props) {
	const { name } = props;
	const href = `#icon-${name}`;
	return (
		<svg className="svg-icon"><use xlinkHref={href} /></svg>
	);
}

export default SvgIcon;
