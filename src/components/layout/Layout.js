import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Container} from 'semantic-ui-react';

export default props => {
	return (
		<Container style={{width: 'auto'}}>
			<Header disabled = {props.disabled} connected = {props.connected} clicked = { props.clicked }/>
			{props.children}
			<Footer />
		</Container>
	);
};
