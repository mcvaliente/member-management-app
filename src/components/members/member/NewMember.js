import React, { Component } from 'react';
import { Form, Input, Message, Dropdown } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import styles from '../../../assets/css/NewMember.module.css';


class NewMember extends Component {
	state = {
		name : '',
		surname : '',
		memberID : '',
		birthdate : '',
		county : '',
		office : '',
		country: 'España',
		email: '',
		occupations: [],
		acceptanceDate: '',
		loading: false,
		errorMessage: ''
	}

	occupationHandler = (e) => {
		console.log(e);
		const occupationsList = [...this.state.occupations];
		const item = e.target.value;
		console.log(item);
		occupationsList.push(item);
		this.setState({occupations : occupationsList});
	};


	onSubmit = async (event) => {

		event.preventDefault();

		//Show loading and reset the error message to an empty string.
		this.setState({ loading : true, errorMessage : '' });

		//const { description, value, recipient, loading, errorMessage } = this.state;


		try{
			alert ('Esto es una prueba');
			//const accounts = await web3.eth.getAccounts();
			//(accounts.length === 0 ? console.log("No accounts.") : console.log ("Web3 accounts: ", accounts));
			//await campaign.methods
			//	.createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
			//	.send({
			//		from: accounts[0]
			//	});

			//Router.pushRoute(`/campaigns/${this.props.address}/requests`);
		}catch (err){
			this.setState({ errorMessage : err.message });
		}

		this.setState({ loading : false });


	}; 

	render () {

		return (
			<div className={styles.NewMember}>
				<NavLink to='/'>Volver</NavLink>
				<h3>Por favor, completa este formulario para la aceptación formal de nuevos socios/as</h3>
				<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
					<Form.Group widths='equal'>
						<Form.Field>
							<label>Nombre</label>
							<Input 
								placeholder = 'Nombre'
								value = {this.state.name}
								onChange = {event => this.setState( { name : event.target.value })}
							/>
						</Form.Field>
						<Form.Field>
							<label>Apellidos</label>
							<Input 
								placeholder = 'Apellidos'
								value = {this.state.surname}
								onChange = {event => this.setState( { surname : event.target.value })}
							/>
						</Form.Field>
					</Form.Group>

					<Form.Field>
							<label>DNI / NIE</label>
							<Input 
								placeholder = 'DNI / NIE'
								value = {this.state.memberID}
								onChange = {event => this.setState( { memberID : event.target.value })}
							/>
					</Form.Field>

					<Form.Group widths='equal'>
						<Form.Field>
							<label>Fecha de nacimiento</label>
							<Input 
								placeholder = 'DD/MM/AAAA'
								value = {this.state.birthdate}
								onChange = {event => this.setState( { birthdate : event.target.value })}
							/>
						</Form.Field>
						<Form.Field>
							<label>Provincia de residencia</label>
							<Input 
								placeholder = 'Provincia de residencia'
								value = {this.state.county}
								onChange = {event => this.setState( { county : event.target.value })}
							/>
						</Form.Field>
					</Form.Group>

					<div className="sytles.occupations">
				        <ul>
          					{this.state.occupations.map(item => <li key={item}>{item}</li>)}
        				</ul>
      				</div>

					<Form.Group widths='equal'>
						<Form.Field>
							<label>Delegación</label>
							<Input 
								placeholder = 'Delegación'
								value = {this.state.office}
								onChange = {event => this.setState( { office : event.target.value })}
							/>
						</Form.Field>
						<Form.Field>
							<label>País</label>
							<Input 
								placeholder = 'País'
								value = {this.state.country}
								disabled
							/>
						</Form.Field>
					</Form.Group>

					<Form.Field>
						<label>Email</label>
						<Input 
							placeholder = 'Email'
							value = {this.state.email}
							onChange = {event => this.setState( { email : event.target.value })}
						/>
					</Form.Field>

					<Form.Field>
						<label>Profesión(es)</label>
						<label>---TODO---</label>
					</Form.Field>

					<Form.Field>
							<label>Fecha de aceptación</label>
							<Input 
								placeholder = 'DD/MM/AAAA'
								value = {this.state.acceptanceDate}
								onChange = {event => this.setState( { acceptanceDate : event.target.value })}
							/>
					</Form.Field>

					<Message error header= "Error Formulario" content={this.state.errorMessage} />
					<button>Aceptar</button>

				</Form>
			</div>
		);
	}
}

export default NewMember;