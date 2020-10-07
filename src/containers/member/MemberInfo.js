import React, { useState, useEffect, useRef } from "react";
import { NavLink, useParams, Redirect } from "react-router-dom";
import { Divider, Form, Input, Message, Icon } from "semantic-ui-react";
import styles from "../../assets/css/MemberInfo.module.css";
import {
  counties,
  offices,
  occupationCategories,
  occupations,
} from "../../utils/dappconfig";
import { getWeb3, checkRinkebyNetwork, getCurrentAccount } from "../../contracts/web3";
import swal from "sweetalert";
import factory from "../../contracts/factory";
import MemberOccupations from "../../components/member/MemberOccupations";
import { Loader } from "../../utils/loader";
import MemberSearch from "../../components/member/MemberSearch";
import {
  checkEmail,
  checkTextField,
  checkDateField,
  greaterThanCurrentDate,
  checkListField,
} from "../../components/member/MemberValidation";

//Using Hooks.
const MemberInfo = (props) => {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [memberID, setMemberID] = useState(id);
  const [birthdate, setBirthdate] = useState("");
  const [county, setCounty] = useState("");
  const [office, setOffice] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [selectedOccupations, setSelectedOccupations] = useState([]);
  const [acceptanceDate, setAcceptanceDate] = useState("");
  const [activeMember, setActiveMember] = useState(false);
  const [applicationFileId, setApplicationFileId] = useState("");
  const [acceptanceFileId, setAcceptanceFileId] = useState("");
  const [countyList, setCountyList] = useState([]);
  const [officeList, setOfficeList] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentOccupation, setCurrentOccupation] = useState("");
  const [occupationCategoryList, setOccupationCategoryList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [inputError, setInputError] = useState({});
  const [returnMainPage, setReturnMainPage] = useState(false);

  const inputNameRef = useRef();
  const inputSurnameRef = useRef();
  const inputBirthdateRef = useRef();
  const inputEmailRef = useRef();
  const inputAcceptanceDateRef = useRef();
  const inputCategoriesRef = useRef();

  //useEffect executes only when the memberID state changes.
  useEffect(() => {
    async function GetMemberInfo() {
      try {
        console.log("Parameter id: ", memberID);
        const web3 = getWeb3();
        //We have to check if web3 has a value.
        if (web3) {
          //Check account.
          const accounts = await web3.eth.getAccounts();
          if (accounts.length === 0) {
            setInputError({});
            swal({
              title: "Error",
              text:
                "Por favor, conéctate a una cuenta de MetaMask para poder recuperar la información de la persona socia.",
              icon: "error",
              button: "Aceptar",
            });
          } else {
            const isRinkeby = checkRinkebyNetwork();
            if (isRinkeby) {
              const bytes16MemberId = web3.utils.fromAscii(memberID);
              //Get the member info stored in the blockchain.
              const memberBasicData = await factory.methods
                .getMemberSummary(bytes16MemberId)
                .call();
              const summaryResult = "[" + JSON.stringify(memberBasicData) + "]";
              ReadMemberSummaryFields(web3, summaryResult);
              //Get the member location.
              const memberLocationData = await factory.methods
                .getMemberLocation(bytes16MemberId)
                .call();
              const locationResult =
                "[" + JSON.stringify(memberLocationData) + "]";
              ReadMemberLocation(web3, locationResult);
              //Get member occupations.
              const memberOccupations = await factory.methods
                .getMemberOccupations(bytes16MemberId)
                .call();
              ReadMemberOccupations(web3, memberOccupations);
              //Get member files.
              const memberFilesData = await factory.methods
                .getMemberFiles(bytes16MemberId)
                .call();
              const filesResult = "[" + JSON.stringify(memberFilesData) + "]";
              ReadMemberFiles(filesResult);
              //Reset the edit mode.
              setEditMode(false);
            } else {
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
          swal({
            title: "Error",
            text:
              "Se ha producido un error al intentar conectarse a la instancia de MetaMask.",
            icon: "error",
            button: "Aceptar",
          });
        }
      } catch (error) {
        swal({
          title: "Error",
          text: error.message,
          icon: "error",
          button: "Aceptar",
        });
      }
    }

    function ReadMemberSummaryFields(web3, memberData) {
      /* eslint-disable no-control-regex*/
      //console.log("Member info: ", memberData);
      const jsonOutput = JSON.parse(memberData);
      for (var j = 0; j < jsonOutput.length; j++) {
        setBirthdate(
          web3.utils.toAscii(jsonOutput[j]["0"]).replace(/\u0000/g, "")
        );
        setAcceptanceDate(
          web3.utils.toAscii(jsonOutput[j]["1"]).replace(/\u0000/g, "")
        );
        setName(jsonOutput[j]["2"]);
        setSurname(jsonOutput[j]["3"]);
        setEmail(jsonOutput[j]["4"]);
        setActiveMember(jsonOutput[j]["5"]);
      }
    }

    function ReadMemberLocation(web3, memberData) {
      /* eslint-disable no-control-regex*/
      //console.log("Member location: ", memberData);
      const jsonOutput = JSON.parse(memberData);
      for (var j = 0; j < jsonOutput.length; j++) {
        setOffice(
          web3.utils.toAscii(jsonOutput[j]["0"]).replace(/\u0000/g, "")
        );
        setCounty(
          web3.utils.toAscii(jsonOutput[j]["1"]).replace(/\u0000/g, "")
        );
        setCountry(
          web3.utils.toAscii(jsonOutput[j]["2"]).replace(/\u0000/g, "")
        );
      }
    }

    function ReadMemberOccupations(web3, memberData) {
      console.log("Member occupations: ", memberData);
      const mOccupations = [];
      for (var i = 0; i < memberData.length; i++) {
        mOccupations.push(
          web3.utils.toAscii(memberData[i]).replace(/\u0000/g, "")
        );
      }
      setSelectedOccupations(mOccupations);
    }

    function ReadMemberFiles(memberData) {
      /* eslint-disable no-control-regex*/
      //console.log("Member files: ", memberData);
      const jsonOutput = JSON.parse(memberData);
      for (var j = 0; j < jsonOutput.length; j++) {
        setApplicationFileId(jsonOutput[j]["0"]);
        setAcceptanceFileId(jsonOutput[j]["1"]);
      }
    }

    //Get the member info from the blockchain.
    GetMemberInfo();

    //Set the initial values of the Select controls for
    //County, Office, Category and Occupations (Edition mode).
    //Counties
    setCountyList(counties);

    //Offices
    setOfficeList(offices);

    //Categories
    setCurrentCategory("cat00");
    setCategoryList(occupationCategories);

    //Occupations
    setCurrentOccupation("occ00000");
    setOccupationCategoryList(occupations);
    //We must to include [] in order to execute this only on Mount.
    //We add "memberID" since if it is changes it should be executed:
  }, [memberID]);

  const onClick = () => {
    setEditMode(true);
  };

  const countySelectHandler = (e) => {
    if (e.target.value !== "countySelection") {
      setCounty(e.target.value);
    }
  };

  const officeSelectHandler = (e) => {
    //console.log ("Selected office: " + e.target.value);
    if (e.target.value !== "officeSelection") {
      setOffice(e.target.value);
    }
  };

  const categorySelectHandler = (e) => {
    //console.log ("Selected category: " + e.target.value);
    //Reset the errors.
    setInputError({});
    if (e.target.value !== "cat00") {
      setCurrentCategory(e.target.value);
    }
  };

  const occupationSelectHandler = (e) => {
    //console.log("Selected occupation: " + e.target.value);
    let newOccupation = e.target.value;
    if (newOccupation !== "occ00000") {
      const occupationsList = [...selectedOccupations];
      //Check that the occupation length is <= 32.
      if (newOccupation.length > 32) {
        //Get 32 characters.
        newOccupation = newOccupation.substring(0, 31);
      }
      setCurrentOccupation("occ00000");
      //Check if the occupation is in the list yet.
      if (!occupationsList.includes(newOccupation)) {
        occupationsList.push(newOccupation);
        setSelectedOccupations(occupationsList);
      }
    }
  };

  const deleteMemberOccupationHandler = (occupationIndex) => {
    const occupations = [...selectedOccupations];
    occupations.splice(occupationIndex, 1);
    setSelectedOccupations(occupations);
  };

  const activeMemberHandler = (e) => {
    const value = e.target.checked;
    setActiveMember(value);
  };

  const memberSearchHandler = (memberId) => {
    console.log("New member id to search: ", memberId);
    setMemberID(memberId);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let validMember = true;
    let errors = {};
    setInputError({});
    try {
      //FIELD VALIDATION

      //Check name
      if (validMember) {
        validMember = checkTextField(name);
        if (!validMember) {
          errors.name = "Por favor, introduce un nombre para el socio/a.";
          setInputError(errors);
          inputNameRef.current.focus();
        }
      }

      //Check surname
      if (validMember) {
        validMember = checkTextField(surname);
        if (!validMember) {
          errors.surname = "Por favor, introduce apellidos para el socio/a.";
          setInputError(errors);
          inputSurnameRef.current.focus();
        }
      }

      //Check birthDate
      if (validMember) {
        validMember = checkDateField(birthdate);
        if (!validMember) {
          errors.birthdate =
            "Por favor, introduce la fecha de nacimiento del socio/a de acuerdo al formato dd/mm/aaaa.";
          setInputError(errors);
          inputBirthdateRef.current.focus();
        } else {
          validMember = greaterThanCurrentDate(birthdate);
          if (!validMember) {
            errors.birthdate =
              "La fecha de nacimiento no puede ser posterior a la fecha actual.";
            setInputError(errors);
            inputBirthdateRef.current.focus();
          }
        }
      }

      //Check email
      if (validMember) {
        validMember = checkEmail(email);
        if (!validMember) {
          errors.email = "Por favor, introduce un email válido.";
          setInputError(errors);
          inputEmailRef.current.focus();
        }
      }

      //Check occupations.
      if (validMember) {
        validMember = checkListField(selectedOccupations);
        if (!validMember) {
          errors.occupations =
            "Por favor, selecciona la profesión(es) vinculadas al socio/a.";
          setInputError(errors);
          setCurrentCategory("cat00");
          setCurrentOccupation("occ00000");
          inputCategoriesRef.current.focus();
        }
      }

      //Check acceptance date
      if (validMember) {
        validMember = checkDateField(acceptanceDate);
        if (!validMember) {
          errors.acceptanceDate =
            "Por favor, introduce una fecha de aceptación válida de acuerdo al formato dd/mm/aaaa.";
          setInputError(errors);
          inputAcceptanceDateRef.current.focus();
        } else {
          validMember = greaterThanCurrentDate(acceptanceDate);
          if (!validMember) {
            errors.acceptanceDate =
              "La fecha de aceptación no puede ser posterior a la fecha actual.";
            setInputError(errors);
            inputAcceptanceDateRef.current.focus();
          }
        }
      }

      if (validMember) {
        //All the fields are OK.
        //Request confirmation from the user in order to save the member in the Blockchain.
        swal({
          title: "¿Continuar?",
          text:
            "Se va a proceder a modificar el registro de la persona socia en la Blockchain de Rinkeby Test Network.",
          icon: "warning",
          buttons: ["Cancelar", "Aceptar"],
          dangerMode: true,
        }).then(async (willContinue) => {
          if (willContinue) {
            //Show loading and reset the error message to an empty string.
            setLoading(true);
            setInputError({});
            try {
              const web3 = getWeb3();
              //We have to check if web3 has a value.
              if (web3) {
                //Check account.
                const accounts = await web3.eth.getAccounts();
                if (accounts.length === 0) {
                  setLoading(false);
                  swal({
                    title: "Error",
                    text:
                      "Por favor, conéctate a una cuenta de MetaMask para poder realizar el registro.",
                    icon: "error",
                    button: "Aceptar",
                  });
                } else {
                  //console.log("Web3 accounts: ", accounts);
                  const isRinkeby = checkRinkebyNetwork();
                  if (isRinkeby) {
                    //Create the new member indicating the creator of this member.
                    const bytes16MemberId = web3.utils.fromAscii(memberID);
                    const bytes16Birthdate = web3.utils.fromAscii(birthdate);
                    const bytes16AcceptanceDate = web3.utils.fromAscii(acceptanceDate);
                    const bytes16MemberDates = [bytes16Birthdate, bytes16AcceptanceDate];

                    //Save the id of the occupation not the name.
                    const bytes16Occupations = selectedOccupations.map(
                      (occupation) => {
                        return web3.utils.fromAscii(occupation);
                      }
                    );
                    const bytes16MemberOffice = web3.utils.fromAscii(office);
                    const bytes16MemberCounty = web3.utils.fromAscii(county);
                    const bytes16MemberCountry = web3.utils.fromAscii(country);
                    const bytes16MemberLocation = [bytes16MemberOffice, bytes16MemberCounty, bytes16MemberCountry];

                    //Get the current account.
                    const currentAccount = getCurrentAccount();
                    await factory.methods
                      .updateMember(
                        activeMember,
                        bytes16MemberId,
                        bytes16MemberDates,
                        name,
                        surname,
                        email,
                        bytes16MemberLocation,
                        bytes16Occupations
                      )
                      .send({
                        from: currentAccount,
                        gas: "2000000",
                      });

                    setLoading(false);
                    swal({
                      title: "La información del socio/a se ha actualizado correctamente.",
                      text: "¿Qué quieres hacer ahora?",
                      icon: "success",
                      buttons: [
                        "Volver a la pantalla principal",
                        "Cerrar",
                      ],
                    }).then(async (willContinue) => {
                      if (willContinue) {
                        setEditMode(false);
                      } else {
                        //Return to the main page.
                        setReturnMainPage(true);
                      }
                    });
                  } else {
                    setLoading(false);
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
                setLoading(false);
                swal({
                  title: "Error",
                  text:
                    "Se ha producido un error al intentar conectarse a la instancia de MetaMask.",
                  icon: "error",
                  button: "Aceptar",
                });
              }
            } catch (error) {
              setLoading(false);
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
      setLoading(false);
      setInputError({});
      errors.general = error.message;
      setInputError(errors);
    }
  };

  if (returnMainPage) {
    return <Redirect to="/" />;
  }
  
  return (
    <div className={styles.MemberInfo}>
      <div style={{ marginBottom: "30px" }}>
        <NavLink to="/">Volver</NavLink>
      </div>
      <MemberSearch
        metaMaskConnected={props.metaMaskConnected}
        memberIdHandler={memberSearchHandler}
      />
      <Divider style={{ width: 900 }} />
      <span className={styles.memberInfoSpan}>
        Hemos encontrado un resultado con NIF/NIE: <strong>{memberID}</strong>
      </span>
      {props.metaMaskConnected  && memberID ? (
        <button className={styles.memberInfoButton} onClick={onClick}>
          Editar perfil
        </button>
      ) : (
        <button className={styles.memberInfoButton} disabled>
          Editar perfil
        </button>
      )}
      <Divider style={{ width: 900 }} />
      <Form onSubmit={onSubmit} error={!!inputError} style={{ width: "100%" }}>
        <Form.Field>
          <div
            className={
              editMode ? "ui toggle checkbox" : "ui toggle disabled checkbox"
            }
          >
            <input
              type="checkbox"
              checked={activeMember}
              onChange={activeMemberHandler}
              tabIndex="-1"
              disabled={!editMode}
              readOnly={!editMode}
            />
            <label>Activo</label>
          </div>
        </Form.Field>
        <Form.Field>
          <label>NIF / NIE</label>
          {/*The NIF/NIE cannot be updated. Always disabled.*/}
          <input
            placeholder="NIF / NIE"
            value={memberID}
            style={{ width: 300, background: "#E3E6E7" }}
            disabled
          />
        </Form.Field>
        <Form.Group widths="equal">
          <Form.Field>
            <label>Nombre</label>
            <input
              placeholder="Nombre"
              value={name}
              onChange={(event) => setName(event.target.value)}
              style={{ width: 400 }}
              onKeyPress={(e) => {
                e.key === "Enter" && e.preventDefault();
              }}
              disabled={!editMode}
              ref={inputNameRef}
            />
            <Message error content={inputError.name} />
          </Form.Field>
          <Form.Field>
            <label>Apellidos</label>
            <input
              placeholder="Apellidos"
              value={surname}
              onChange={(event) => setSurname(event.target.value)}
              onKeyPress={(e) => {
                e.key === "Enter" && e.preventDefault();
              }}
              style={{ width: 500 }}
              disabled={!editMode}
              ref={inputSurnameRef}
            />
            <Message error content={inputError.surname} />
          </Form.Field>
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field>
            <label>Fecha de nacimiento</label>
            <input
              placeholder="DD/MM/AAAA"
              value={birthdate}
              onChange={(event) => setBirthdate(event.target.value)}
              style={{ width: 200 }}
              onKeyPress={(e) => {
                e.key === "Enter" && e.preventDefault();
              }}
              disabled={!editMode}
              ref={inputBirthdateRef}
            />
            <Message error content={inputError.birthdate} />
          </Form.Field>
          <Form.Field>
            <label>Provincia de residencia</label>
            <select
              value={county}
              onChange={countySelectHandler}
              style={{ width: 300 }}
              disabled={!editMode}
            >
              <option key="selectCounty" value="countySelection">
                Selecciona una provincia...
              </option>
              {countyList.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </Form.Field>
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field>
            <label>Delegación</label>
            <select
              value={office}
              onChange={officeSelectHandler}
              style={{ width: 300 }}
              disabled={!editMode}
            >
              <option key="selectOffice" value="officeSelection">
                Selecciona una delegación...
              </option>
              {officeList.map((item) => (
                <option key={item.id}>{item.name}</option>
              ))}
            </select>
          </Form.Field>
          <Form.Field>
            <label>País</label>
            <input
              placeholder="País"
              value={country}
              disabled
              style={
                editMode
                  ? { width: 300, background: "#F7F8F8" }
                  : { width: 300 }
              }
            />
          </Form.Field>
        </Form.Group>
        <Form.Field>
          <label>Email</label>
          <Input
            placeholder="Email"
            type="email"
            iconPosition="left"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={{ width: 400 }}
            disabled={!editMode}
            ref={inputEmailRef}
          >
            <Icon name="at" />
            <input />
          </Input>
          <Message error content={inputError.email} />
        </Form.Field>
        {editMode ? (
          <Form.Group>
            <Form.Field>
              <label>Categoría</label>
              <select
                value={currentCategory}
                onChange={categorySelectHandler}
                style={{ width: 300 }}
                ref={inputCategoriesRef}
              >
                <option key="selectCategory" value="cat00">
                  Selecciona una categoría...
                </option>
                {categoryList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <Message error content={inputError.occupations} />
            </Form.Field>
            <Form.Field>
              <label>Profesión(es)</label>
              <select
                value={currentOccupation}
                onChange={occupationSelectHandler}
                style={{ width: 300 }}
                disabled={currentCategory === "cat00"}
              >
                <option id="selectOccupation" value="occ00000">
                  Selecciona una profesión...
                </option>
                {occupationCategoryList.map((item) =>
                  item.category === currentCategory ? (
                    <option key={item.id}>{item.name}</option>
                  ) : null
                )}
              </select>
            </Form.Field>
          </Form.Group>
        ) : (
          <Form.Field>
            <label>Profesión(es)</label>
          </Form.Field>
        )}
        <div className={styles.memberInfoOccupationSelectedList}>
          <MemberOccupations
            occupations={selectedOccupations}
            clicked={deleteMemberOccupationHandler}
            canDelete={editMode}
          />
        </div>
        <Form.Field>
          <label>Fecha de aceptación</label>
          <input
            placeholder="DD/MM/AAAA"
            value={acceptanceDate}
            onChange={(event) => setAcceptanceDate(event.target.value)}
            style={{ width: 200 }}
            onKeyPress={(e) => {
              e.key === "Enter" && e.preventDefault();
            }}
            disabled={!editMode}
            ref={inputAcceptanceDateRef}
          />
          <Message error content={inputError.acceptanceDate} />
        </Form.Field>
        {/*TODO: Add the files stored in IPFS. They only can be downloaded but not modified.*/}
        <Form.Field>
          <label>Fichero de solicitud</label>
          {/*The application file cannot be updated. Only downloaded: TODO.*/}
          <input
            value={applicationFileId}
            style={{ width: 425, background: "#E3E6E7" }}
            disabled
          />
        </Form.Field>
        <Form.Field>
          <label>Certificado de aceptación</label>
          {/*The acceptance file cannot be updated. Only downloaded: TODO.*/}
          <input
            value={acceptanceFileId}
            style={{ width: 425, background: "#E3E6E7" }}
            disabled
          />
        </Form.Field>

        <Message error content={inputError.general} />
        <div className={styles.memberInfoButtonSection}>
          {editMode ? (
            props.metaMaskConnected ? (
              <button className={styles.memberInfoButton}>Aceptar</button>
            ) : (
              <button className={styles.memberInfoButton} disabled>
                Aceptar
              </button>
            )
          ) : null}
        </div>
      </Form>
      {loading ? <Loader></Loader> : null}
    </div>
  );
};

export default MemberInfo;
