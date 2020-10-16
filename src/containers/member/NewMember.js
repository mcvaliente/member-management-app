import React, { Component } from "react";
import { Form, Input, Message, Icon, Image } from "semantic-ui-react";
import { NavLink, Redirect } from "react-router-dom";
import styles from "../../assets/css/NewMember.module.css";
import {
  counties,
  offices,
  occupationCategories,
  occupations,
} from "../../utils/dappconfig";
import {
  checkEmail,
  checkTextField,
  checkID,
  checkDateField,
  greaterThanCurrentDate,
  checkListField,
} from "../../components/member/MemberValidation";
import {
  getWeb3,
  checkRinkebyNetwork,
  getCurrentAccount,
} from "../../contracts/web3";
import swal from "sweetalert";
import factory from "../../contracts/factory";
import { Loader } from "../../utils/loader";
import FileUploader from "../../utils/FileUploader";
import MemberOccupations from "../../components/member/MemberOccupations";

const srcAttachFileIcon = "/images/attach-file-icon.svg";
const srcDeleteIcon = "/images/delete-icon.svg";
const web3 = getWeb3();


class NewMember extends Component {
  state = {
    name: "",
    surname: "",
    memberID: "",
    birthdate: "",
    county: "",
    office: "",
    country: "España",
    email: "",
    selectedOccupations: [],
    acceptanceDate: "",
    countyList: [],
    officeList: [],
    currentCategory: "",
    currentOccupation: "",
    applicationFileId: "",
    applicationFileName: "",
    //applicationFile: null,
    acceptanceFileId: "",
    acceptanceFileName: "",
    //acceptanceFile: null,
    occupationCategoryList: [],
    categoryList: [],
    loading: false,
    errorMessages: {},
    returnMainPage: false,
  };

  async componentDidMount() {
    if (web3) {
      //Check account.
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        this.setState({ loading: false, errorMessages: {} });
        swal({
          title: "Error",
          text:
            "Por favor, conéctate a una cuenta de MetaMask para poder realizar el registro.",
          icon: "error",
          button: "Aceptar",
        });
      } else {
        console.log("Web3 accounts: ", accounts);
        const isRinkeby = checkRinkebyNetwork();
        if (isRinkeby) {
          //Set the initial values of the Select controls for
          //County, Office, Category and Occupations.
          //Counties
          this.setState({ countyList: counties });

          //Offices
          this.setState({ officeList: offices });

          //Categories
          this.setState({ currentCategory: "cat00" });
          this.setState({ categoryList: occupationCategories });

          //Occupations
          this.setState({ currentOccupation: "occ00000" });
          this.setState({ occupationCategoryList: occupations });
        } else {
          this.setState({ loading: false, errorMessages: {} });
          swal({
            title: "Error",
            text:
              "Por favor, selecciona la red Rinkeby para poder realizar el registro.",
            icon: "error",
            button: "Aceptar",
          });
        }
      }
    } else {
      this.setState({ loading: false, errorMessages: {} });
      swal({
        title: "Error",
        text:
          "Se ha producido un error al intentar conectarse a la instancia de MetaMask.",
        icon: "error",
        button: "Aceptar",
      });
    }
  }

  countySelectHandler = (e) => {
    //console.log ("Selected county: " + e.target.value);

    if (e.target.value !== "countySelection") {
      this.setState({ county: e.target.value });
    }
  };

  officeSelectHandler = (e) => {
    //console.log ("Selected office: " + e.target.value);

    if (e.target.value !== "officeSelection") {
      this.setState({ office: e.target.value });
    }
  };

  categorySelectHandler = (e) => {
    //console.log ("Selected category: " + e.target.value);

    if (e.target.value !== "cat00") {
      this.setState({ currentCategory: e.target.value });
    }
  };

  occupationSelectHandler = (e) => {
    //console.log("Selected occupation: " + e.target.value);
    let newOccupation = e.target.value;
    if (e.target.value !== "occ00000") {
      const occupationsList = [...this.state.selectedOccupations];
      //Check that the occupation length is <= 32.
      if (newOccupation.length > 32) {
        //Get 32 characters.
        newOccupation = newOccupation.substring(0, 31);
      }
      this.setState({ currentOccupation: "occ00000" });
      //Check if the occupation is in the list yet.
      if (!occupationsList.includes(newOccupation)) {
        occupationsList.push(newOccupation);
        this.setState({ selectedOccupations: occupationsList });
      }
    }
  };

  deleteMemberOccupationHandler = (occupationIndex) => {
    const occupations = [...this.state.selectedOccupations];
    occupations.splice(occupationIndex, 1);
    this.setState({ selectedOccupations: occupations });
  };

  applicationFileSelectionHandler = (fileUploaded) => {
    console.log("Uploaded application file object: ", fileUploaded);
    let reader = new FileReader();
    reader.readAsDataURL(fileUploaded);
    //this.setState({
    //  applicationFileName: fileUploaded.name,
    //  applicationFile: fileUploaded,
    //});
    this.setState({
      applicationFileName: fileUploaded.name,
    });
  };

  deleteApplicationFileClickHandler = () => {
    //this.setState({ applicationFileName: "", applicationFile: null });
    this.setState({ applicationFileName: "" });
  };

  onDocumentLoadSuccess = (filename) => {
    console.log("Filename:", filename);
  };

  acceptanceFileSelectionHandler = (fileUploaded) => {
    console.log("Uploaded acceptance member file object", fileUploaded);
    let reader = new FileReader();
    reader.readAsDataURL(fileUploaded);
    //this.setState({
    //  acceptanceFileName: fileUploaded.name,
    //  //acceptanceFile: fileUploaded,
    //});
    this.setState({
      acceptanceFileName: fileUploaded.name,
      //acceptanceFile: fileUploaded,
    });
  };

  deleteAcceptanceFileClickHandler = () => {
    //this.setState({ acceptanceFileName: "", acceptanceFile: null });
    this.setState({ acceptanceFileName: "" });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    let validMember = true;
    let errors = {};
    const bytes16MemberId = web3.utils.fromAscii(this.state.memberID);

    //Shortcut for states of this class.
    const {
      memberID,
      name,
      surname,
      birthdate,
      county,
      office,
      email,
      selectedOccupations,
      acceptanceDate,
      applicationFileName,
      //applicationFile,
      acceptanceFileName,
      //acceptanceFile
    } = this.state;

    //Reset the error message to an empty string.
    this.setState({ errorMessages: {} });

    try {
      //FIELD VALIDATION
      //Check memberId
      validMember = checkID(memberID);
      if (!validMember) {
        this.memberIDInputRef.focus();
        errors["memberID"] = "Por favor, introduce una identificación válida (NIF/NIE).";
        this.setState({ errorMessages : errors });
      } else {
        //Check that we don't have the same ID in the cooperative.
        const existingMember = await factory.methods
          .memberExists(bytes16MemberId)
          .call();
        console.log("Existing member: ", existingMember);
        if (existingMember) {
          validMember = false;
          this.memberIDInputRef.focus();
          errors["memberID"] = "Ya existe una persona socia con la misma identificación.";
          this.setState({ errorMessages: errors });
        }
      }

      //Check name
      if (validMember) {
        validMember = checkTextField(name);
        if (!validMember) {
          this.nameInputRef.focus();
          errors["name"] = "Por favor, introduce el nombre del nuevo/a socio/a.";
          this.setState({ errorMessages: errors });
        }
      }

      //Check surname
      if (validMember) {
        validMember = checkTextField(surname);
        if (!validMember) {
          this.surnameInputRef.focus();
          errors["surname"] = "Por favor, introduce los apellidos del nuevo/a socio/a.";
          this.setState({ errorMessages: errors });
        }
      }

      //Check birthDate
      if (validMember) {
        validMember = checkDateField(birthdate);
        if (!validMember) {
          this.birthdateInputRef.focus();
          errors["birthdate"] = "Por favor, introduce una fecha de nacimiento válida de acuerdo al formato dd/mm/aaaa.";
          this.setState({ errorMessages: errors });
        } else {
          validMember = greaterThanCurrentDate(birthdate);
          if (!validMember) {
            this.birthdateInputRef.focus();
            errors["birthdate"] = "La fecha de nacimiento no puede ser posterior a la fecha actual.";
            this.setState({ errorMessages: errors });
          }
        }
      }

      //Check county
      if (validMember) {
        validMember = checkTextField(county);
        if (!validMember) {
          this.countyInputRef.focus();
          errors["county"] = "Por favor, selecciona la provincia de residencia del nuevo/a socio/a.";
          this.setState({ errorMessages: errors });
        }
      }

      //Check office
      if (validMember) {
        validMember = checkTextField(office);
        if (!validMember) {
          this.officeInputRef.focus();
          errors["office"] = "Por favor, selecciona la delegación a la que pertenece el nuevo/a socio/a.";
          this.setState({ errorMessages: errors });
        }
      }

      //Check email
      if (validMember) {
        validMember = checkEmail(email);
        if (!validMember) {
          this.emailInputRef.focus();
          errors["email"] = "Por favor, introduce un email válido.";
          this.setState({ errorMessages: errors });
        }
      }

      //Check occupations.
      if (validMember) {
        validMember = checkListField(selectedOccupations);
        if (!validMember) {
          this.occupationsInputRef.focus();
          errors["occupations"] = "Por favor, selecciona la profesión(es) del nuevo/a socio/a.";
          this.setState({ errorMessages: errors });
        }
      }

      //Check acceptance date
      if (validMember) {
        validMember = checkDateField(acceptanceDate);
        if (!validMember) {
          this.acceptanceDateInputRef.focus();
          errors["acceptanceDate"] = "Por favor, introduce una fecha de aceptación válida de acuerdo al formato dd/mm/aaaa.";
          this.setState({ errorMessages: errors });
        } else {
          validMember = greaterThanCurrentDate(acceptanceDate);
          if (!validMember) {
            this.acceptanceDateInputRef.focus();
            errors["acceptanceDate"] = "La fecha de aceptación no puede ser posterior a la fecha actual.";
            this.setState({ errorMessages: errors });
          }
        }
      }

      //Check the application file.
      if (validMember) {
        validMember = applicationFileName !== "";
        if (!validMember) {
          this.applicationFileNameInputRef.focus();
          errors["applicationFileName"] = "Por favor, selecciona el fichero de solicitud asociado al alta del nuevo/a socio/a.";
          this.setState({ errorMessages: errors });
        }
      }

      //Check the acceptance file.
      if (validMember) {
        validMember = acceptanceFileName !== "";
        if (!validMember) {
          this.acceptanceFileNameInputRef.focus();
          errors["acceptanceFileName"] = "Por favor, selecciona el fichero de aceptación del nuevo/a socio/a.";
          this.setState({ errorMessages: errors });
        }
      }

      if (validMember) {
        //All the fields are OK.
        //Request confirmation from the user in order to save the member in the Blockchain.
        swal({
          title: "¿Continuar?",
          text:
            "Se va a proceder al registro de la persona socia en la Blockchain de Rinkeby Test Network.",
          icon: "warning",
          buttons: ["Cancelar", "Aceptar"],
          dangerMode: true,
        }).then(async (willContinue) => {
          if (willContinue) {
            //Show loading and reset the error message to an empty string.
            this.setState({ loading: true, errorMessages: {} });
            //We have to check if web3 has a value.
            //Create the new member indicating the creator of this member.
            const bytes16Birthdate = web3.utils.fromAscii(this.state.birthdate);
            const bytes16AcceptanceDate = web3.utils.fromAscii(
              this.state.acceptanceDate
            );
            const bytes16MemberDates = [
              bytes16Birthdate,
              bytes16AcceptanceDate,
            ];

            //Save the id of the occupation not the name.
            const bytes16Occupations = this.state.selectedOccupations.map(
              (occupation) => {
                return web3.utils.fromAscii(occupation);
              }
            );
            const bytes16MemberOffice = web3.utils.fromAscii(this.state.office);
            const bytes16MemberCounty = web3.utils.fromAscii(this.state.county);
            const bytes16MemberCountry = web3.utils.fromAscii(
              this.state.country
            );
            const bytes16MemberLocation = [
              bytes16MemberOffice,
              bytes16MemberCounty,
              bytes16MemberCountry,
            ];

            // TODO: Add the functionality to store the files in IPFS.
            //TESTING: We will have the hashes from IPFS for each file.
            const applicationFileId =
              "AnPs55rrWMXcRVuK8HqCcXABCSPn6HDrd9ngjEzMTKdDtD";
            const acceptanceFileId =
              "QmNs55rrWMXcRVuK8HqCcXCHLSPn6HDrd9ngjEzMTKdDtX";

            //Get the current account.
            const currentAccount = getCurrentAccount();
            await factory.methods
              .createMember(
                bytes16MemberId,
                bytes16MemberDates,
                this.state.name,
                this.state.surname,
                this.state.email,
                bytes16MemberLocation,
                bytes16Occupations,
                applicationFileId,
                acceptanceFileId
              )
              .send({
                from: currentAccount,
                gas: "2000000",
              });

            this.setState({ loading: false, errorMessages: {} });
            swal({
              title: "Has añadido a este socio/a correctamente.",
              text: "¿Qué quieres hacer ahora?",
              icon: "success",
              buttons: ["Volver a la pantalla principal", "Añadir socio/a"],
            }).then(async (willContinue) => {
              if (willContinue) {
                //Add a new member.
                //Reset the form fields.
                this.setState({
                  name: "",
                  surname: "",
                  memberID: "",
                  birthdate: "",
                  county: "",
                  office: "",
                  country: "España",
                  email: "",
                  selectedOccupations: [],
                  acceptanceDate: "",
                  currentCategory: "cat00",
                  categoryList: occupationCategories,
                  currentOccupation: "occ00000",
                  occupationCategoryList: occupations,
                  applicationFileName: "",
                  //applicationFile: null,
                  acceptanceFileName: "",
                  //acceptanceFile: null
                });
              } else {
                //Return to the main page.
                this.setState({ returnMainPage: true });
              }
            });
          }
        });
      }
    } catch (error) {
      errors["general"] = error.message;
      this.setState({ loading: false, errorMessages: errors });
    }
  };

  render() {
    if (this.state.returnMainPage) {
      return <Redirect to="/" />;
    }
    return (
      <div className={styles.NewMember}>
        <NavLink to="/">Volver</NavLink>
        <h3>
          Por favor, completa este formulario para la aceptación formal de
          nuevos socios/as
        </h3>
        <Form
          onSubmit={this.onSubmit}
          error={!!this.state.errorMessages}
          style={{ width: "100%" }}
        >
          <Form.Field>
            <label>NIF / NIE</label>
            <input
              placeholder="NIF / NIE"
              value={this.state.memberID}
              onChange={(event) =>
                this.setState({ memberID: event.target.value })
              }
              style={{ width: 300 }}
              onKeyPress={(e) => {
                e.key === "Enter" && e.preventDefault();
              }}
              ref={input => { this.memberIDInputRef = input; }}
            />
            <Message error content={this.state.errorMessages.memberID} />
          </Form.Field>
          <Form.Group widths="equal">
            <Form.Field>
              <label>Nombre</label>
              <input
                placeholder="Nombre"
                value={this.state.name}
                onChange={(event) =>
                  this.setState({ name: event.target.value })
                }
                style={{ width: 400 }}
                onKeyPress={(e) => {
                  e.key === "Enter" && e.preventDefault();
                }}
                ref={input => { this.nameInputRef = input; }}
              />
              <Message error content={this.state.errorMessages.name} />
            </Form.Field>
            <Form.Field>
              <label>Apellidos</label>
              <input
                placeholder="Apellidos"
                value={this.state.surname}
                onChange={(event) =>
                  this.setState({ surname: event.target.value })
                }
                onKeyPress={(e) => {
                  e.key === "Enter" && e.preventDefault();
                }}
                style={{ width: 500 }}
                ref={input => { this.surnameInputRef = input; }}
              />
              <Message error content={this.state.errorMessages.surname} />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field>
              <label>Fecha de nacimiento</label>
              <input
                placeholder="DD/MM/AAAA"
                value={this.state.birthdate}
                onChange={(event) =>
                  this.setState({ birthdate: event.target.value })
                }
                style={{ width: 200 }}
                onKeyPress={(e) => {
                  e.key === "Enter" && e.preventDefault();
                }}
                ref={input => { this.birthdateInputRef = input; }}
              />
              <Message error content={this.state.errorMessages.birthdate} />
            </Form.Field>
            <Form.Field>
              <label>Provincia de residencia</label>
              <select
                value={this.state.county}
                onChange={this.countySelectHandler}
                style={{ width: 300 }}
                ref={input => { this.countyInputRef = input; }}
              >
                <option key="selectCounty" value="countySelection">
                  Selecciona una provincia...
                </option>
                {this.state.countyList.map((item) => (
                  <option key={item.id}>{item.name}</option>
                ))}
              </select>
              <Message error content={this.state.errorMessages.county} />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field>
              <label>Delegación</label>
              <select
                value={this.state.office}
                onChange={this.officeSelectHandler}
                style={{ width: 300 }}
                ref={input => { this.officeInputRef = input; }}
              >
                <option key="selectOffice" value="officeSelection">
                  Selecciona una delegación...
                </option>
                {this.state.officeList.map((item) => (
                  <option key={item.id}>{item.name}</option>
                ))}
              </select>
              <Message error content={this.state.errorMessages.office} />
            </Form.Field>
            <Form.Field>
              <label>País</label>
              <input
                placeholder="País"
                value={this.state.country}
                disabled
                style={{ width: 300, background: "#F7F8F8" }}
              />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            <label>Email</label>
            <Input
              placeholder="Email"
              type="email"
              iconPosition="left"
              value={this.state.email}
              onChange={(event) => this.setState({ email: event.target.value })}
              style={{ width: 400 }}
              ref={input => { this.emailInputRef = input; }}
            >
              <Icon name="at" />
              <input />
            </Input>
            <Message error content={this.state.errorMessages.email} />
          </Form.Field>
          <Form.Group>
            <Form.Field>
              <label>Categoría</label>
              <select
                value={this.state.currentCategory}
                onChange={this.categorySelectHandler}
                style={{ width: 300 }}
                ref={input => { this.occupationsInputRef = input; }}
              >
                <option key="selectCategory" value="cat00">
                  Selecciona una categoría...
                </option>
                {this.state.categoryList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <Message error content={this.state.errorMessages.occupations} />
            </Form.Field>
            <Form.Field>
              <label>Profesión(es)</label>
              <select
                value={this.state.currentOccupation}
                onChange={this.occupationSelectHandler}
                style={{ width: 300 }}
                disabled={this.state.currentCategory === "cat00"}
              >
                <option key="selectOccupation" value="occ00000">
                  Selecciona una profesión...
                </option>
                {this.state.occupationCategoryList.map((item) =>
                  item.category === this.state.currentCategory ? (
                    <option key={item.id}>{item.name}</option>
                  ) : null
                )}
              </select>
            </Form.Field>
          </Form.Group>
          <div className={styles.newMemberOccupationSelectedList}>
            <MemberOccupations
              occupations={this.state.selectedOccupations}
              clicked={this.deleteMemberOccupationHandler}
              canDelete={true}
            />
          </div>
          <Form.Field>
            <label>Fecha de aceptación</label>
            <input
              placeholder="DD/MM/AAAA"
              value={this.state.acceptanceDate}
              onChange={(event) =>
                this.setState({ acceptanceDate: event.target.value })
              }
              style={{ width: 200 }}
              onKeyPress={(e) => {
                e.key === "Enter" && e.preventDefault();
              }}
              ref={input => { this.acceptanceDateInputRef = input; }}
            />
            <Message error content={this.state.errorMessages.acceptanceDate} />
          </Form.Field>
          <Form.Field>
            <label>Adjuntar archivos</label>
          </Form.Field>
          {/*TODO: Add the files to store in IPFS.*/}
          <Form.Field>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              ref={input => { this.applicationFileNameInputRef = input; }}
            >
              <label style={{ marginRight: "50px", width: 180 }}>
                Fichero de solicitud
              </label>
              {!!this.state.applicationFileName ? (
                <>
                  <Image src={srcAttachFileIcon} spaced="right" />
                  <label
                    style={{ marginLeft: "2px" }}
                    onClick={this.onDocumentLoadSuccess(
                      this.state.applicationFileName
                    )}
                  >
                    {this.state.applicationFileName}
                  </label>
                  <Image
                    key="btnDeleteApplicationFile"
                    src={srcDeleteIcon}
                    onClick={this.deleteApplicationFileClickHandler}
                    style={{ cursor: "pointer", marginLeft: "20px" }}
                  />
                </>
              ) : (
                //The filename of the application file is empty. The user has to load it.
                <FileUploader
                  handleFile={this.applicationFileSelectionHandler}
                  metaMaskConnected={this.props.metaMaskConnected}
                />
              )}
            </div>
            <Message error content={this.state.errorMessages.applicationFileName} />
          </Form.Field>
          <Form.Field>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              ref={input => { this.acceptanceFileNameInputRef = input; }}
            >
              <label style={{ marginRight: "50px", width: 180 }}>
                Certificado de aceptación
              </label>
              {!!this.state.acceptanceFileName ? (
                <>
                  <Image src={srcAttachFileIcon} spaced="right" />
                  <label style={{ marginLeft: "2px" }}>
                    {this.state.acceptanceFileName}
                  </label>
                  <Image
                    key="btnDeleteAcceptanceFile"
                    src={srcDeleteIcon}
                    onClick={this.deleteAcceptanceFileClickHandler}
                    style={{ cursor: "pointer", marginLeft: "20px" }}
                  />
                </>
              ) : (
                <FileUploader
                  handleFile={this.acceptanceFileSelectionHandler}
                  metaMaskConnected={this.props.metaMaskConnected}
                />
              )}
            </div>
            <Message error content={this.state.errorMessages.acceptanceFileName} />
          </Form.Field>
          <Message error content={this.state.errorMessages.general} />
          <div className={styles.newMemberButtonSection}>
            {this.props.metaMaskConnected ? (
              <button className={styles.newMemberButton}>Aceptar</button>
            ) : (
              <button className={styles.newMemberButton} disabled>
                Aceptar
              </button>
            )}
          </div>
        </Form>
        {this.state.loading ? <Loader></Loader> : null}
      </div>
    );
  }
}

export default NewMember;
