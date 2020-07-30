import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "../../assets/css/MemberInfo.module.css";
import {
  counties,
  offices,
  occupationCategories,
  occupations,
} from "../../utils/smartconfig";
import { Grid, Divider, GridColumn } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import {
  getWeb3,
  checkRinkebyNetwork
} from "../../contracts/web3";
import swal from "sweetalert";
import factory from "../../contracts/factory";
import { Redirect } from 'react-router-dom';
import Member from "../../contracts/member";
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
  const [selectedOccupations, setOccupations] = useState([]);
  const [acceptanceDate, setAcceptanceDate] = useState("");
  const [countyList, setCountyList] = useState([]);
  const [officeList, setOfficeList] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentOccupation, setCurrentOccupation] = useState("");
  const [occupationCategoryList, setOccupationCategoryList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [returnMainPage, setReturnMainPage] = useState(false);
  const [memberEdition, setMemberEdition] = useState(false);

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
            if (isRinkeby){
              //Get the current account.
              const bytes32MemberId = web3.utils.fromAscii(memberID);
              //Get the contract address for this member.
              const memberContractAddress = await factory.methods
                .getMemberAddress(bytes32MemberId)
                .call();
              console.log("Contract address for this member ID: ", memberContractAddress);
              if (memberContractAddress === "0x0000000000000000000000000000000000000000") {
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

    function ReadMemberSummaryFields(web3, memberData){
      console.log("Member info: ", memberData);
      const jsonOutput = JSON.parse(memberData);
      for (var j = 0; j < jsonOutput.length; j++) {
        console.log("NIF/NIE: ", web3.utils.toAscii(jsonOutput[j]["0"]));
      }
    }

    function ReadMemberOccupations(web3, memberData){
      console.log("Member occupations: ", memberData);
      for (var i = 0; i < memberData.length; i++) {
        console.log("Occupation(" , i, "): ", web3.utils.toAscii(memberData[i]));
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
    setCurrentCategory("categorySelection");
    setCategoryList(occupationCategories);

    //Occupations
    setCurrentOccupation("occupationSelection");
    setOccupationCategoryList(occupations);
  });

  if (returnMainPage){
    return <Redirect to="/" />
  }
  return (
    <div className={styles.MemberInfo}>
      <NavLink to="/">Volver</NavLink>
      <Grid>
        <Grid.Row>
          <Divider />
          <Grid.Column width={7} style={{ marginTop: 10 }}>
            <span className={styles.memberInfoSpan}>
              Hemos encontrado un resultado con NIF/NIE: <strong>{id}</strong>
            </span>
          </Grid.Column>
          <Grid.Column width={3}>
            {props.metaMaskConnected ? (
              /*TODO: Quitar la propiedad 'disabled' cuando implemente la edición*/
              <button className={styles.memberInfoButton} disabled>Editar perfil</button>
            ) : (
              <button className={styles.memberInfoButton} disabled>
                Editar perfil
              </button>
            )}
          </Grid.Column>
          <Divider />
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default MemberInfo;
