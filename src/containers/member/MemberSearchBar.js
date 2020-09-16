import React, { useState } from "react";
import { getWeb3, checkRinkebyNetwork } from "../../contracts/web3";
import factory from "../../contracts/factory";
import swal from "sweetalert";

const MemberSearchBar = (props) => {

  const [loading, setLoading] = useState(false);

  const memberHandler = (memberId) => {
    props.memberIdHandler(memberId);
  };

  const keyPressHandler = (e) => {
    if (e.key === "Enter") {
      //Check if we have this member Id in the blockchain.
      memberSearchHandler(e.target.value);
    }
  };

  const memberSearchHandler = async (memberId) => {
    try {
      setLoading(true);
      console.log("Member to check: " + memberId);
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
          const isRinkeby = checkRinkebyNetwork();
          if (isRinkeby) {
            //Check that the member has been included.
            const bytes32MemberId = web3.utils.fromAscii(memberId);
            //Check that we don't have the same ID in the cooperative.
            const memberAddress = await factory.methods
              .getMemberAddress(bytes32MemberId)
              .call();
            console.log("Contract address for this member ID: ", memberAddress);
            setLoading(false);
            if (
              memberAddress !== "0x0000000000000000000000000000000000000000"
            ) {
              //The member ID has been found in the blockchain.
              //We assign the props.
              memberHandler(memberId);
            } else {
              swal({
                title: "Error",
                text:
                  "La persona socia con identificación '" +
                  memberId +
                  "' no se encuentra registrada.",
                icon: "error",
                button: "Aceptar",
              });
            }
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
  };


  return (
    <div
      className={loading ? "ui loading icon input" : "ui icon input"}
      style={{ marginLeft: "20px" }}
    >
      <input
        type="text"
        placeholder="Busca por NIF/NIE..."
        disabled={!props.metaMaskConnected}
        onKeyPress={keyPressHandler}
      />
      <i aria-hidden="true" className="search icon"></i>
    </div>
  );
}

export default MemberSearchBar;
