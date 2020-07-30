import React from 'react';
import { Grid } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import styles from '../../assets/css/NotFound.module.css';

const srcNotFoundImg = '/images/404-error-icon.png';

export default () => {
	return (
		<div className={styles.NotFound}>
			<Grid columns={2} padded>
					<Grid.Column width={5}>
						<p style={{color: '#FF3C56'}}>Página no encontrada</p>
						<p style={{color: '#FF3C56'}}>Error<span style={{ marginLeft:'20px', fontSize: '50px', fontWeight:'bold', color:'#FF3C56'}}>404</span></p>
						<br />
						<p>¡Lo sentimos! La página que buscas no está en el servidor. Puedes dirigirte a la <NavLink to='/'>página principal</NavLink> e intentarlo de nuevo.</p>
					</Grid.Column>
					<Grid.Column width={5} style={{marginLeft:'100px'}}>
						<img alt='error-404' src={srcNotFoundImg} ></img>
					</Grid.Column>
			</Grid>
		</div>
	);
};
