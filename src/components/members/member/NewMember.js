import React, { Component } from 'react';
import { Form, Input, Message, Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import styles from '../../../assets/css/NewMember.module.css';
import { counties, offices, categories, occupations } from '../../../utils/smartutils';
import { checkEmail, checkTextField, checkID, checkDateField, checkListField } from './MemberValidation';
import SmartAlert from '../../../utils/smartalert';

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
		countyList : [],
		officeList : [],
		currentCategory:'',
		currentOccupation:'',
		occupationCategoryList: [],
		categoryList: [],
		loading: false,
		errorMessage: '',
		finishForm : false
	}

	componentDidMount (){

		//Set the initial values of the Select controls for 
		//County, Office, Category and Occupations.
		//Counties
		this.setState({ countyList: counties });

		//Offices
		this.setState({ officeList: offices });

		//Categories
		this.setState({currentCategory : 'categorySelection'});
		this.setState({ categoryList: categories });

		//Occupations
		this.setState({currentOccupation : 'occupationSelection'})
		this.setState({ occupationCategoryList : occupations });
	}

	countySelectHandler = (e) => {
		console.log ("Selected county: " + e.target.value);
		
		if (e.target.value !== 'countySelection')	
		{
			this.setState({ county : e.target.value });
		}
	};

	officeSelectHandler = (e) => {
		console.log ("Selected office: " + e.target.value);
		
		if (e.target.value !== 'officeSelection')	
		{
			this.setState({ office : e.target.value });
		}
	};

	categorySelectHandler = (e) => {
		console.log ("Selected category: " + e.target.value);
		
		if (e.target.value !== 'categorySelection')	
		{
			this.setState({ currentCategory : e.target.value });
		}
	};

	occupationSelectHandler = (e) => {
		console.log("Selected occupation: " + e.target.value);
		if (e.target.value !== "occupationSelection") {
			const occupationsList = [...this.state.occupations];
			this.setState({ currentOccupation : e.target.value });
			//Check if the occupation is in the list yet.
			if (!occupationsList.includes(e.target.value)){
				occupationsList.push(e.target.value);
				this.setState({occupations : occupationsList});		
			}
		}
	};

	onSubmit = async (event) => {

		event.preventDefault();
		let validMember = true;

		//Shortcut for states of this class.
		const { name, surname, memberID, birthdate, county, office, email, occupations, acceptanceDate } = this.state;

		//Show loading and reset the error message to an empty string.
		this.setState({ errorMessage : '' });

		try{
			//FIELD VALIDATION

			//Check name
			console.log("Name: "  + name);
			validMember = checkTextField(name);
			if (!validMember){
				this.setState({ loading: false, errorMessage : 'Por favor, introduce el nombre del nuevo/a socio/a.'});	
			}
			
			//Check surname
			if (validMember)
			{
				validMember = checkTextField(surname);
				if (!validMember){
					this.setState({ loading: false, errorMessage : 'Por favor, introduce los apellidos del nuevo/a socio/a.'});
				}
			}

			//Check memberId
			if (validMember){
				validMember = checkID (memberID);
				if (!validMember){
					this.setState({ loading: false, errorMessage : 'Por favor, introduce una identificación válida (DNI/NIE).'});
				}
			}

			//Check birthDate
			if (validMember){
				if (validMember){
					validMember = checkDateField(birthdate);
					if (!validMember){
						this.setState({ loading: false, errorMessage : 'Por favor, introduce una fecha de nacimiento válida de acuerdo al formato dd/mm/aaaa.'});
					}
				}	
			}

			//Check county
			if (validMember){
				if (validMember){
					validMember = checkTextField(county);
					if (!validMember){
						this.setState({ loading: false, errorMessage : 'Por favor, selecciona la provincia de residencia del nuevo/a socio/a.'});
					}
				}	
			}

			//Check office
			if (validMember){
				if (validMember){
					validMember = checkTextField(office);
					if (!validMember){
						this.setState({ loading: false, errorMessage : 'Por favor, selecciona la delegación a la que pertecen el nuevo/a socio/a.'});
					}
				}	
			}

			//Check email
			if (validMember){
				validMember = checkEmail(email);
				if (!validMember) {
					this.setState({ loading: false, errorMessage : 'Por favor, introduce un email válido.'});
				} 	
			}

			//Check occupations.
			if (validMember){
				if (validMember){
					validMember = checkListField(occupations);
					if (!validMember){
						this.setState({ loading: false, errorMessage : 'Por favor, selecciona la profesión(es) del nuevo/a socio/a.'});
					}
				}	
			}

			//Check acceptance date
			if (validMember){
				if (validMember){
					validMember = checkDateField(acceptanceDate);
					if (!validMember){
						this.setState({ loading: false, errorMessage : 'Por favor, introduce una fecha de aceptación válida de acuerdo al formato dd/mm/aaaa.'});
					}
				}	
			}

			if (validMember)
			{
				//All the fields are OK.
				this.setState({finishForm : true});
				//Request confirmation from the user in order to save the member in the Blockchain.

				//const accounts = await web3.eth.getAccounts();
				//(accounts.length === 0 ? console.log("No accounts.") : console.log ("Web3 accounts: ", accounts));
				//await campaign.methods
				//	.createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
				//	.send({
				//		from: accounts[0]
				//	});

				//Router.pushRoute(`/campaigns/${this.props.address}/requests`);
				//this.setState({
				//	loading : false, 
				//	name : '', 
				//	surname : '', 
				//	memberID : '', 
				//	birthdate : '', 
				//	county: '', 
				//	office: '', 
				//	email : '', 
				//	occupations : [], 
				//	acceptanceDate : '',
				//	currentCategory : 'categorySelection',
				//	currentOccupation : 'occupationSelection'
				//});

			}

		}catch (err){
			this.setState({ errorMessage : err.message });
		}

	}; 

	render () {

		return (
			<div className={styles.NewMember}>
				<NavLink to='/'>Volver</NavLink>
				<h3>Por favor, completa este formulario para la aceptación formal de nuevos socios/as</h3>
				<Form loading={this.state.loading} onSubmit={this.onSubmit} error={!!this.state.errorMessage} style={{width : '80%'}}>
					<Form.Group widths='equal'>
						<Form.Field>
							<label>Nombre</label>
							<input 
								placeholder = 'Nombre'
								value = {this.state.name}
								onChange = {event => this.setState( { name : event.target.value })}
								style={{width: 400}}
								onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
							/>
						</Form.Field>
						<Form.Field>
							<label>Apellidos</label>
							<input 
								placeholder = 'Apellidos'
								value = {this.state.surname}
								onChange = {event => this.setState( { surname : event.target.value })}
								onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
							/>
						</Form.Field>
					</Form.Group>

					<Form.Field>
							<label>DNI / NIE</label>
							<input 
								placeholder = 'NIF / NIE'
								value = {this.state.memberID}
								onChange = {event => this.setState( { memberID : event.target.value })}
								style={{width: 300}}
								onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
							/>
					</Form.Field>

					<Form.Group widths='equal'>
						<Form.Field>
							<label>Fecha de nacimiento</label>
							<input 
								placeholder = 'DD/MM/AAAA'
								value = {this.state.birthdate}
								onChange = {event => this.setState( { birthdate : event.target.value })}
								style={{width: 200}}
								onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
							/>
						</Form.Field>
						<Form.Field>
							<label>Provincia de residencia</label>
							<select 
								value={this.state.county} 
								onChange = {this.countySelectHandler} 
								style={{width: 300}}
							>
								<option key="selectCounty" value="countySelection">Selecciona una provincia...</option>
								{this.state.countyList.map(item => <option key={item.id}>{item.name}</option>)}
							</select>
						</Form.Field>
					</Form.Group>

					<Form.Group widths='equal'>
						<Form.Field>
							<label>Delegación</label>
							<select 
								value={this.state.office} 
								onChange = {this.officeSelectHandler} 
								style={{width: 300}}
							>
								<option key="selectOffice" value="officeSelection">Selecciona una delegación...</option>
								{this.state.officeList.map(item => <option key={item.id}>{item.name}</option>)}
							</select>
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
							type='email'
							iconPosition = 'left'
							value = {this.state.email}
							onChange = {event => this.setState( { email : event.target.value })}
							style={{width: 400}}
						>
							<Icon name= 'at' />
							<input />
						</Input>
					</Form.Field> 

					<Form.Group>
						<Form.Field>
							<label>Categoría</label>
							<select 
								value={this.state.currentCategory} 
								onChange = {this.categorySelectHandler} 
								style={{width: 300}}
							>
								<option key="selectCategory" value="categorySelection">Selecciona una categoría...</option>
								{this.state.categoryList.map(item => <option key={item.id}>{item.name}</option>)}
							</select>
						</Form.Field>
						<Form.Field>
							<label>Profesión(es)</label>
							<select 
								value={this.state.currentOccupation} 
								onChange = {this.occupationSelectHandler} 
								style={{width: 300}}
								disabled={this.state.currentCategory === 'categorySelection'}							
							>
								<option id="selectOccupation" value="occupationSelection">Selecciona una profesión...</option>
								{this.state.occupationCategoryList.map(item => (item.category === this.state.currentCategory ? <option key={item.id}>{item.name}</option> : null))}
							</select>
						</Form.Field>
					</Form.Group>

					 <div>
						<p>Lista de profesiones totales:</p>
				        <ul>
          					{this.state.occupationCategoryList.map(item => <li key={item.id}>{item.name} - ({item.category})</li>)}
        				</ul>
      				</div>

					<div>
						<p>Lista de profesiones seleccionadas:</p>
				        <ul>
          					{this.state.occupations.map(item => <li key={item}>{item}</li>)}
        				</ul>
      				</div>
					
					<Form.Field>
								<label>Fecha de aceptación</label>
								<input 
									placeholder = 'DD/MM/AAAA'
									value = {this.state.acceptanceDate}
									onChange = {event => this.setState( { acceptanceDate : event.target.value })}
									style={{width: 200}}
									onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
								/>
					</Form.Field>

					<Message error content={this.state.errorMessage} />
					<div className={styles.newMemberButtonSection}>
						{this.props.metaMaskConnected ? <button className={styles.newMemberButton}>Aceptar</button> : <button className={styles.newMemberButton} disabled>Aceptar</button>}
					</div>
				</Form>
				{this.state.finishForm ? <SmartAlert></SmartAlert> : null}
			</div>
		);
	}
}

export default NewMember;