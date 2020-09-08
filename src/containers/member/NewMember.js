import React, { Component } from "react";
import { Form, Input, Message, Icon, Image } from "semantic-ui-react";
import { NavLink, Redirect } from "react-router-dom";
import styles from "../../assets/css/NewMember.module.css";
import {
  counties,
  offices,
  occupationCategories,
  occupations,
} from "../../utils/smartconfig";
import {
  checkEmail,
  checkTextField,
  checkID,
  checkDateField,
  greaterThanCurrentDate,
  checkListField,
} from "../../components/members/member/MemberValidation";
import {
  getWeb3,
  checkRinkebyNetwork,
  getCurrentAccount,
} from "../../contracts/web3";
import swal from "sweetalert";
import factory from "../../contracts/factory";
import { Loader } from "../../utils/smartloader";
import FileUploader from "../../utils/FileUploader";
import MemberOccupations from "../../components/members/member/MemberOccupations";

const srcAttachFileIcon = "/images/attach-file-icon.svg";
const srcDeleteIcon = "/images/delete-icon.svg";

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
    applicationFileName: "",
    applicationFile: null,
    memberAcceptanceFileName: "",
    memberAcceptanceFile: null,
    occupationCategoryList: [],
    categoryList: [],
    loading: false,
    errorMessage: "",
    returnMainPage: false,
  };

  componentDidMount() {
    //Set the initial values of the Select controls for
    //County, Office, Category and Occupations.
    //Counties
    this.setState({ countyList: counties });

    //Offices
    this.setState({ officeList: offices });

    //Categories
    this.setState({ currentCategory: "categorySelection" });
    this.setState({ categoryList: occupationCategories });

    //Occupations
    this.setState({ currentOccupation: "occupationSelection" });
    this.setState({ occupationCategoryList: occupations });
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

    if (e.target.value !== "categorySelection") {
      this.setState({ currentCategory: e.target.value });
    }
  };

  occupationSelectHandler = (e) => {
    //console.log("Selected occupation: " + e.target.value);
    if (e.target.value !== "occupationSelection") {
      const occupationsList = [...this.state.selectedOccupations];
      this.setState({ currentOccupation: e.target.value });
      //Check if the occupation is in the list yet.
      if (!occupationsList.includes(e.target.value)) {
        occupationsList.push(e.target.value);
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
    console.log("Uploaded application file object", fileUploaded);
    let reader = new FileReader();
    reader.readAsDataURL(fileUploaded);
    this.setState({
      applicationFileName: fileUploaded.name,
      applicationFile: fileUploaded,
    });
  };

  deleteApplicationFileClickHandler = () => {
    this.setState({ applicationFileName: "", applicationFile: null });
  };

  onDocumentLoadSuccess = (filename) => {
    console.log("Filename:", filename);
  };

  memberAcceptanceFileSelectionHandler = (fileUploaded) => {
    console.log("Uploaded acceptance member file object", fileUploaded);
    let reader = new FileReader();
    reader.readAsDataURL(fileUploaded);
    this.setState({
      memberAcceptanceFileName: fileUploaded.name,
      memberAcceptanceFile: fileUploaded,
    });
  };

  deleteMemberAcceptanceFileClickHandler = () => {
    this.setState({ memberAcceptanceFileName: "", memberAcceptanceFile: null });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    let validMember = true;

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
      applicationFile,
      memberAcceptanceFileName,
      memberAcceptanceFile
    } = this.state;

    //Reset the error message to an empty string.
    this.setState({ errorMessage: "" });

    try {
      //FIELD VALIDATION

      //Check memberId
      validMember = checkID(memberID);
      if (!validMember) {
        this.setState({
          errorMessage:
            "Por favor, introduce una identificación válida (NIF/NIE)."
        });
      }

      //Check name
      if (validMember) {
        validMember = checkTextField(name);
        if (!validMember) {
          this.setState({
            errorMessage: "Por favor, introduce el nombre del nuevo/a socio/a."
          });
        }
      }

      //Check surname
      if (validMember) {
        validMember = checkTextField(surname);
        if (!validMember) {
          this.setState({
            errorMessage:
              "Por favor, introduce los apellidos del nuevo/a socio/a."
          });
        }
      }

      //Check birthDate
      if (validMember) {
        validMember = checkDateField(birthdate);
        if (!validMember) {
          this.setState({
            errorMessage:
              "Por favor, introduce una fecha de nacimiento válida de acuerdo al formato dd/mm/aaaa."
          });
        } else {
          validMember = greaterThanCurrentDate(birthdate);
          if (!validMember) {
            this.setState({
              errorMessage:
                "La fecha de nacimiento no puede ser posterior a la fecha actual."
            });
          }
        }
      }

      //Check county
      if (validMember) {
        validMember = checkTextField(county);
        if (!validMember) {
          this.setState({
            errorMessage:
              "Por favor, selecciona la provincia de residencia del nuevo/a socio/a."
          });
        }
      }

      //Check office
      if (validMember) {
        validMember = checkTextField(office);
        if (!validMember) {
          this.setState({
            errorMessage:
              "Por favor, selecciona la delegación a la que pertenece el nuevo/a socio/a."
          });
        }
      }

      //Check email
      if (validMember) {
        validMember = checkEmail(email);
        if (!validMember) {
          this.setState({
            errorMessage: "Por favor, introduce un email válido."
          });
        }
      }

      //Check occupations.
      if (validMember) {
        validMember = checkListField(selectedOccupations);
        if (!validMember) {
          this.setState({
            errorMessage:
              "Por favor, selecciona la profesión(es) del nuevo/a socio/a."
          });
        }
      }

      //Check acceptance date
      if (validMember) {
        validMember = checkDateField(acceptanceDate);
        if (!validMember) {
          this.setState({
            errorMessage:
              "Por favor, introduce una fecha de aceptación válida de acuerdo al formato dd/mm/aaaa.",
          });
        } else {
          validMember = greaterThanCurrentDate(acceptanceDate);
          if (!validMember) {
            this.setState({
              errorMessage:
                "La fecha de aceptación no puede ser posterior a la fecha actual."
            });
          }
        }
      }

      //Check application file.
      if (validMember) {
        validMember = applicationFileName !== '';
        if (!validMember) {
          this.setState({
            errorMessage:
              "Por favor, selecciona el fichero de solicitud asociado al alta del nuevo/a socio/a."
          });
        }
      }

      //Check application file.
      if (validMember) {
        validMember = memberAcceptanceFileName !== '';
        if (!validMember) {
          this.setState({
            errorMessage:
              "Por favor, selecciona el fichero de aceptación del nuevo/a socio/a."
          });
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
            this.setState({ loading: true, errorMessage: "" });
            try {
              const web3 = getWeb3();
              //We have to check if web3 has a value.
              if (web3) {
                //Check account.
                const accounts = await web3.eth.getAccounts();
                if (accounts.length === 0) {
                  this.setState({ loading: false, errorMessage: "" });
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
                    //Get the current account.
                    const currentAccount = getCurrentAccount();
                    const bytes32MemberId = web3.utils.fromAscii(
                      this.state.memberID
                    );
                    //Check that we don't have the same ID in the cooperative.
                    const memberAddress = await factory.methods
                      .getMemberAddress(bytes32MemberId)
                      .call();
                    console.log(
                      "Contract address for this member ID: ",
                      memberAddress
                    );
                    if (
                      memberAddress !==
                      "0x0000000000000000000000000000000000000000"
                    ) {
                      this.setState({ loading: false, errorMessage: "" });
                      swal({
                        title: "Error",
                        text:
                          "Ya existe una persona socia con la misma identificación.",
                        icon: "error",
                        button: "Aceptar",
                      });
                    } else {
                      //Create the new member indicating the creator of this member.
                      const bytes32Birthdate = web3.utils.fromAscii(
                        this.state.birthdate
                      );
                      const bytes32AcceptanceDate = web3.utils.fromAscii(
                        this.state.acceptanceDate
                      );
                      const bytes32MemberDates = [
                        bytes32Birthdate,
                        bytes32AcceptanceDate,
                      ];
                      const bytes32Occupations = this.state.selectedOccupations.map(
                        (occupation) => {
                          return web3.utils.fromAscii(occupation);
                        }
                      );
                      const bytes32MemberOffice = web3.utils.fromAscii(
                        this.state.office
                      );
                      const bytes32MemberCounty = web3.utils.fromAscii(
                        this.state.county
                      );
                      const bytes32MemberCountry = web3.utils.fromAscii(
                        this.state.country
                      );
                      const bytes32MemberLocation = [
                        bytes32MemberOffice,
                        bytes32MemberCounty,
                        bytes32MemberCountry,
                      ];

                      await factory.methods
                        .createMember(
                          bytes32MemberId,
                          bytes32MemberDates,
                          this.state.name,
                          this.state.surname,
                          this.state.email,
                          bytes32MemberLocation,
                          bytes32Occupations
                        )
                        .send({
                          from: currentAccount,
                          gas: "2000000",
                        });

                      // TODO: Add the functionality to store the files in IPFS.

                      this.setState({ loading: false, errorMessage: "" });
                      swal({
                        title: "Has añadido a este socio/a correctamente.",
                        text: "¿Qué quieres hacer ahora?",
                        icon: "success",
                        buttons: [
                          "Volver a la pantalla principal",
                          "Añadir socio/a",
                        ],
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
                            currentCategory: "categorySelection",
                            categoryList: occupationCategories,
                            currentOccupation: "occupationCategories",
                            occupationCategoryList: occupations,
                          });
                        } else {
                          //Return to the main page.
                          this.setState({ returnMainPage: true });
                        }
                      });
                    }
                  } else {
                    this.setState({ loading: false, errorMessage: "" });
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
                this.setState({ loading: false, errorMessage: "" });
                swal({
                  title: "Error",
                  text:
                    "Se ha producido un error al intentar conectarse a la instancia de MetaMask.",
                  icon: "error",
                  button: "Aceptar",
                });
              }
            } catch (error) {
              this.setState({ loading: false, errorMessage: "" });
              swal({
                title: "Error",
                text: error.message,
                icon: "error",
                button: "Aceptar",
              });
            }
          }
        });
      }
    } catch (error) {
      this.setState({ loading: false, errorMessage: error.message });
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
          error={!!this.state.errorMessage}
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
            />
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
              />
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
              />
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
              />
            </Form.Field>
            <Form.Field>
              <label>Provincia de residencia</label>
              <select
                value={this.state.county}
                onChange={this.countySelectHandler}
                style={{ width: 300 }}
              >
                <option key="selectCounty" value="countySelection">
                  Selecciona una provincia...
                </option>
                {this.state.countyList.map((item) => (
                  <option key={item.id}>{item.name}</option>
                ))}
              </select>
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field>
              <label>Delegación</label>
              <select
                value={this.state.office}
                onChange={this.officeSelectHandler}
                style={{ width: 300 }}
              >
                <option key="selectOffice" value="officeSelection">
                  Selecciona una delegación...
                </option>
                {this.state.officeList.map((item) => (
                  <option key={item.id}>{item.name}</option>
                ))}
              </select>
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
            >
              <Icon name="at" />
              <input />
            </Input>
          </Form.Field>
          <Form.Group>
            <Form.Field>
              <label>Categoría</label>
              <select
                value={this.state.currentCategory}
                onChange={this.categorySelectHandler}
                style={{ width: 300 }}
              >
                <option key="selectCategory" value="categorySelection">
                  Selecciona una categoría...
                </option>
                {this.state.categoryList.map((item) => (
                  <option key={item.id}>{item.name}</option>
                ))}
              </select>
            </Form.Field>
            <Form.Field>
              <label>Profesión(es)</label>
              <select
                value={this.state.currentOccupation}
                onChange={this.occupationSelectHandler}
                style={{ width: 300 }}
                disabled={this.state.currentCategory === "categorySelection"}
              >
                <option key="selectOccupation" value="occupationSelection">
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
            />
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
          </Form.Field>
          <Form.Field>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <label style={{ marginRight: "50px", width: 180 }}>
                Certificado de aceptación
              </label>
              {!!this.state.memberAcceptanceFileName ? (
                <>
                  <Image src={srcAttachFileIcon} spaced="right" />
                  <label style={{ marginLeft: "2px" }}>
                    {this.state.memberAcceptanceFileName}
                  </label>
                  <Image
                    key="btnDeleteMemberAcceptanceFile"
                    src={srcDeleteIcon}
                    onClick={this.deleteMemberAcceptanceFileClickHandler}
                    style={{ cursor: "pointer", marginLeft: "20px" }}
                  />
                </>
              ) : (
                <FileUploader
                  handleFile={this.memberAcceptanceFileSelectionHandler}
                  metaMaskConnected={this.props.metaMaskConnected}
                />
              )}
            </div>
          </Form.Field>
          <Message error content={this.state.errorMessage} />
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
