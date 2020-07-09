import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default props => {
	return (
		<div>
			<Header disabled = {props.disabled} connected = {props.connected} clicked = { props.clicked }/>
			{props.children}
			<Footer />
		</div>
	);
};
