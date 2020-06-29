import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default props => {
	return (
		<div>
			<Header disabled = {props.disabled} />
			{props.children}
			<Footer />
		</div>
	);
};
