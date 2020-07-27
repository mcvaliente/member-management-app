import React, { Component } from "react";
import { Form, Input, Message, Icon } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import styles from "../../assets/css/NewMember.module.css";
import {
  counties,
  offices,
  categories,
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
import Member from "../../contracts/member";
import { Loader } from "../../utils/smartloader";
import MemberOccupations from "../../components/members/member/MemberOccupations";

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
    occupations: [],
    acceptanceDate: "",
    countyList: [],
    officeList: [],
    currentCategory: "",
    currentOccupation: "",
    occupationCategoryList: [],
    categoryList: [],
    loading: false,
    errorMessage: ""
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
    this.setState({ categoryList: categories });

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
      const occupationsList = [...this.state.occupations];
      this.setState({ currentOccupation: e.target.value });
      //Check if the occupation is in the list yet.
      if (!occupationsList.includes(e.target.value)) {
        occupationsList.push(e.target.value);
        this.setState({ occupations: occupationsList });
      }
    }
  };

  deleteMemberOccupationHandler = (occupationIndex) => {
    const occupations = [...this.state.occupations];
    occupations.splice(occupationIndex, 1);
    this.setState({ occupations: occupations });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    let validMember = true;

    //Shortcut for states of this class.
    const {
      name,
      surname,
      memberID,
      birthdate,
      county,
      office,
      email,
      occupations,
      acceptanceDate,
    } = this.state;

    //Reset the error message to an empty string.
    this.setState({ errorMessage: "" });

    try {
      //FIELD VALIDATION

      //Check name
      validMember = checkTextField(name);
      if (!validMember) {
        this.setState({
          errorMessage: "Por favor, introduce el nombre del nuevo/a socio/a.",
        });
      }

      //Check surname
      if (validMember) {
        validMember = checkTextField(surname);
        if (!validMember) {
          this.setState({
            errorMessage:
              "Por favor, introduce los apellidos del nuevo/a socio/a.",
          });
        }
      }

      //Check memberId
      if (validMember) {
        validMember = checkID(memberID);
        if (!validMember) {
          this.setState({
            errorMessage:
              "Por favor, introduce una identificación válida (NIF/NIE).",
          });
        }
      }

      //Check birthDate
      if (validMember) {
        if (validMember) {
          validMember = checkDateField(birthdate);
          if (!validMember) {
            this.setState({
              errorMessage:
                "Por favor, introduce una fecha de nacimiento válida de acuerdo al formato dd/mm/aaaa.",
            });
          } else {
            validMember = greaterThanCurrentDate(birthdate);
            if (!validMember) {
              this.setState({
                errorMessage:
                  "La fecha de nacimiento no puede ser posterior a la fecha actual.",
              });
            }
          }
        }
      }

      //Check county
      if (validMember) {
        if (validMember) {
          validMember = checkTextField(county);
          if (!validMember) {
            this.setState({
              errorMessage:
                "Por favor, selecciona la provincia de residencia del nuevo/a socio/a.",
            });
          }
        }
      }

      //Check office
      if (validMember) {
        if (validMember) {
          validMember = checkTextField(office);
          if (!validMember) {
            this.setState({
              errorMessage:
                "Por favor, selecciona la delegación a la que pertecen el nuevo/a socio/a.",
            });
          }
        }
      }

      //Check email
      if (validMember) {
        validMember = checkEmail(email);
        if (!validMember) {
          this.setState({
            errorMessage: "Por favor, introduce un email válido.",
          });
        }
      }

      //Check occupations.
      if (validMember) {
        if (validMember) {
          console.log("Occupations: ", occupations);
          validMember = checkListField(occupations);
          if (!validMember) {
            this.setState({
              errorMessage:
                "Por favor, selecciona la profesión(es) del nuevo/a socio/a.",
            });
          }
        }
      }

      //Check acceptance date
      if (validMember) {
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
                  "La fecha de aceptación no puede ser posterior a la fecha actual.",
              });
            }
          }
        }
      }

      if (validMember) {
        //All the fields are OK.
        //swal("Form successfully filled!");
        //Request confirmation from the user in order to save the member in the Blockchain.
        swal({
          title: "¿Continuar?",
          text:
            "Se va a proceder al registro del nuevo/a socio/a en la Blockchain de Rinkeby Test Network.",
          icon: "warning",
          buttons: true,
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
                  swal(
                    "Error",
                    "Por favor, conéctate a una cuenta de MetaMask para poder realizar el registro.",
                    "error"
                  );
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
                      this.setState({ loading: false });
                      swal(
                        "Error",
                        "Ya existe una persona socia con la misma identificación.",
                        "error"
                      );
                    } else {
                      //Create the new member indicating the creator of this member.
                      await factory.methods.createMember(bytes32MemberId).send({
                        from: currentAccount,
                        gas: "2000000",
                      });

                      //Check that the member has been included.
                      const memberContractAddress = await factory.methods
                        .getMemberAddress(bytes32MemberId)
                        .call();
                      console.log(
                        "Member contract address: " + memberContractAddress
                      );
                      //Total members.
                      const memberCount = await factory.methods
                        .getMemberCount()
                        .call();
                      console.log("Total members: " + memberCount);
                      //Check the deployed members.
                      const smartMembers = await factory.methods
                        .getDeployedMembers()
                        .call();
                      let count = 1;
                      smartMembers.map((address) => {
                        console.log("member(" + count + "): " + address);
                        count++;
                        return true;
                      });

                      //Now we can store the member data in the blockchain
                      const member = Member(memberContractAddress);
                      const bytes32Birthdate = web3.utils.fromAscii(
                        this.state.birthdate
                      );
                      const bytes32AcceptanceDate = web3.utils.fromAscii(
                        this.state.acceptanceDate
                      );
                      await member.methods
                        .addMemberBasicInformation(
                          bytes32MemberId,
                          this.state.name,
                          this.state.surname,
                          bytes32Birthdate,
                          bytes32AcceptanceDate
                        )
                        .send({
                          from: currentAccount,
                          gas: "2000000",
                        });

                      //Add the location
                      await member.methods
                        .addMemberLocation(
                          this.state.county,
                          this.state.office,
                          this.state.country
                        )
                        .send({
                          from: currentAccount,
                          gas: "1000000",
                        });

                      //Add the occupations
                      for (var i = 0; i < this.state.occupations.length; i++) {
                        await member.methods
                          .addMemberOccupation(occupations[i])
                          .send({
                            from: currentAccount,
                            gas: "1000000",
                          });
                      }

                      //Check the member info stored in the blockchain.
                      const memberInfo = await member.methods
                        .getMemberSummary()
                        .call();
                      const output = "[" + JSON.stringify(memberInfo) + "]";
                      console.log("Member info: ", output);
                      const jsonOutput = JSON.parse(output);
                      let totalOccupations = 0;
                      for (var j = 0; j < jsonOutput.length; j++) {
                        console.log(
                          "NIF/NIE: ",
                          web3.utils.toAscii(jsonOutput[j]["0"])
                        );
                        totalOccupations = parseInt(jsonOutput[j]["5"], 10);
                        console.log("Total occupations: ", totalOccupations);
                      }

                      //Member location
                      const memberLocation = await member.methods
                        .getMemberLocation()
                        .call();
                      const outputLocation = JSON.stringify(memberLocation);
                      console.log("Member location: ", outputLocation);
                      const jsonOutputLocation = JSON.parse(outputLocation);
                      console.log("Office: ", jsonOutputLocation["0"]);
                      console.log("County: ", jsonOutputLocation["1"]);
                      console.log("Country: ", jsonOutputLocation["2"]);

                      //Member occupations
                      let memberOccupation;
                      for (var l = 0; l < totalOccupations; l++) {
                        memberOccupation = await member.methods
                          .getMemberOccupation(l)
                          .call();
                        console.log(
                          "Member occupation (",
                          l,
                          "):",
                          memberOccupation
                        );
                      }

                      // TODO: Add the functionality to store the files in IPFS.

                      //Reset the form fields.
                      this.setState({
                        loading: false,
                        name: "",
                        surname: "",
                        memberID: "",
                        birthdate: "",
                        county: "",
                        office: "",
                        email: "",
                        occupations: [],
                        acceptanceDate: "",
                        currentCategory: "categorySelection",
                        currentOccupation: "occupationSelection",
                      });

                      swal(
                        "¡Proceso completo!",
                        "El nuevo/a socio/a se ha registrado en la Blockchain sin ninguna incidencia.",
                        "success"
                      );
                    }
                  } else {
                    this.setState({ loading: false, errorMessage: "" });
                    swal(
                      "Error",
                      "Por favor, selecciona la red Rinkeby para poder realizar el registro",
                      "error"
                    );
                  }
                }
              } else {
                this.setState({ loading: false, errorMessage: "" });
                swal(
                  "Error",
                  "Se ha producido un error al intentar conectarse a la instancia de MetaMask.",
                  "error"
                );
              }
            } catch (error) {
              this.setState({ loading: false });
              swal("Error", error.message, "error");
            }
          }
        });
      }
    } catch (error) {
      this.setState({ loading: false, errorMessage: error.message });
    }
  };

  render() {
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
                <option id="selectOccupation" value="occupationSelection">
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
              occupations={this.state.occupations}
              clicked={this.deleteMemberOccupationHandler}
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
          {/*TODO: Add the files to store in IPFS.*/}
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
