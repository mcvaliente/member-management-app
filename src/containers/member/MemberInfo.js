import React, { useState, useEffect } from "react";
import { NavLink, Redirect, useParams } from "react-router-dom";
import { Divider, Form, Input, Message, Icon } from "semantic-ui-react";
import styles from "../../assets/css/MemberInfo.module.css";
import {
  counties,
  offices,
  occupationCategories,
  occupations,
} from "../../utils/smartconfig";
import { getWeb3, checkRinkebyNetwork } from "../../contracts/web3";
import swal from "sweetalert";
import factory from "../../contracts/factory";
import Member from "../../contracts/member";
import MemberOccupations from "../../components/members/member/MemberOccupations";
import { Loader } from "../../utils/smartloader";

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
  const [countyList, setCountyList] = useState([]);
  const [officeList, setOfficeList] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentOccupation, setCurrentOccupation] = useState("");
  const [occupationCategoryList, setOccupationCategoryList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [returnMainPage, setReturnMainPage] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    async function GetMemberInfo() {
      try {
        const web3 = getWeb3();
        //We have to check if web3 has a value.
        if (web3) {
          //Check account.
          const accounts = await web3.eth.getAccounts();
          if (accounts.length === 0) {
            setErrorMessage("");
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
              //Get the current account.
              const bytes32MemberId = web3.utils.fromAscii(memberID);
              //Get the contract address for this member.
              const memberContractAddress = await factory.methods
                .getMemberAddress(bytes32MemberId)
                .call();
              console.log(
                "Contract address for this member ID: ",
                memberContractAddress
              );
              if (
                memberContractAddress ===
                "0x0000000000000000000000000000000000000000"
              ) {
                swal({
                  title: "Error",
                  text:
                    "No se ha podido recuperar la localización de la persona socia.",
                  icon: "error",
                  button: "Aceptar",
                });
                setReturnMainPage(true);
              } else {
                //Get the member info stored in the blockchain.
                const member = Member(memberContractAddress);
                const memberInfo = await member.methods
                  .getMemberSummary()
                  .call();
                const result = "[" + JSON.stringify(memberInfo) + "]";
                ReadMemberSummaryFields(web3, result);
                //Get the member occupations.
                const memberOccupations = await member.methods
                  .getMemberOccupations()
                  .call();
                ReadMemberOccupations(web3, memberOccupations);
              }
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
      console.log("Member info: ", memberData);
      const jsonOutput = JSON.parse(memberData);
      for (var j = 0; j < jsonOutput.length; j++) {
        setMemberID(web3.utils.toAscii(jsonOutput[j]["0"]).replace(/\u0000/g, ''));
        setBirthdate(web3.utils.toAscii(jsonOutput[j]["1"]).replace(/\u0000/g, ''));
        setAcceptanceDate(web3.utils.toAscii(jsonOutput[j]["2"]).replace(/\u0000/g, ''));
        setName(jsonOutput[j]["3"]);
        setSurname(jsonOutput[j]["4"]);
        setEmail(jsonOutput[j]["5"])
        setOffice(web3.utils.toAscii(jsonOutput[j]["6"]).replace(/\u0000/g, ''));
        setCounty(web3.utils.toAscii(jsonOutput[j]["7"]).replace(/\u0000/g, ''));
        setCountry(web3.utils.toAscii(jsonOutput[j]["8"]).replace(/\u0000/g, ''));
        setActiveMember(jsonOutput[j]["9"]);
      }
    }

    function ReadMemberOccupations(web3, memberData) {
      console.log("Member occupations: ", memberData);
      const mOccupations = [];
      for (var i = 0; i < memberData.length; i++) {
        mOccupations.push(web3.utils.toAscii(memberData[i]).replace(/\u0000/g, ''));
      }
      setSelectedOccupations(mOccupations);
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
    setCurrentCategory("categorySelection");
    setCategoryList(occupationCategories);

    //Occupations
    setCurrentOccupation("occupationSelection");
    setOccupationCategoryList(occupations);
    //We must to include [] in order to execute this only on Mount.
    //We add "memberID" since if it is changes it should be executed:
  }, [memberID]);

  const onSubmit = (e, data) => {
    e.preventDefault();
    setLoading(true);
    console.log("onSubmit data: ", data);
    setLoading(false);
    setErrorMessage("");
    swal("Pendiente de implementar");
  };

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

    if (e.target.value !== "categorySelection") {
      setCurrentCategory(e.target.value);
    }
  };

  const occupationSelectHandler = (e) => {
    //console.log("Selected occupation: " + e.target.value);
    if (e.target.value !== "occupationSelection") {
      const occupationsList = [...selectedOccupations];
      setCurrentOccupation(e.target.value);
      //Check if the occupation is in the list yet.
      if (!occupationsList.includes(e.target.value)) {
        occupationsList.push(e.target.value);
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

  if (returnMainPage) {
    return <Redirect to="/" />;
  }
  return (
    <div className={styles.MemberInfo}>
      <NavLink to="/">Volver</NavLink>
      <Divider style={{ width: 900 }} />
      <span className={styles.memberInfoSpan}>
        Hemos encontrado un resultado con NIF/NIE: <strong>{id}</strong>
      </span>
      {props.metaMaskConnected ? (
        <button className={styles.memberInfoButton} onClick={onClick}>
          Editar perfil
        </button>
      ) : (
        <button className={styles.memberInfoButton} disabled>
          Editar perfil
        </button>
      )}
      <Divider style={{ width: 900 }} />
      <Form
        onSubmit={onSubmit}
        error={!!errorMessage}
        style={{ width: "100%" }}
      >
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
            />
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
            />
          </Form.Field>
        </Form.Group>
        <Form.Field>
          <label>NIF / NIE</label>
          <input
            placeholder="NIF / NIE"
            value={memberID}
            onChange={(event) => setMemberID(event.target.value)}
            style={{ width: 300 }}
            onKeyPress={(e) => {
              e.key === "Enter" && e.preventDefault();
            }}
            disabled={!editMode}
          />
        </Form.Field>
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
            />
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
                  <option key={item.id} value={item.name}>{item.name}</option>
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
          >
            <Icon name="at" />
            <input />
          </Input>
        </Form.Field>
        {editMode ? 
          <Form.Group>
            <Form.Field>
              <label>Categoría</label>
              <select
                value={currentCategory}
                onChange={categorySelectHandler}
                style={{ width: 300 }}
              >
                <option key="selectCategory" value="categorySelection">
                  Selecciona una categoría...
                </option>
                {categoryList.map((item) => (
                  <option key={item.id}>{item.name}</option>
                ))}
              </select>
            </Form.Field>
            <Form.Field>
              <label>Profesión(es)</label>
              <select
                value={currentOccupation}
                onChange={occupationSelectHandler}
                style={{ width: 300 }}
                disabled={currentCategory === "categorySelection"}
              >
                <option id="selectOccupation" value="occupationSelection">
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
        :
          <Form.Field>
              <label>Profesión(es)</label>
          </Form.Field>
        }
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
          />
        </Form.Field>
        {/*TODO: Add the files to store in IPFS.*/}
        <Message error content={errorMessage} />
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
