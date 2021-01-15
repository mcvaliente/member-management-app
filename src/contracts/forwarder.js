import { getWeb3 } from "./web3";
import Forwarder from "./build/Forwarder.json";

let instance;
const web3 = getWeb3();
//We have to check if web3 has a value.
//If we don't check it we don't obtain any
//output in the Microsoft Edge Browser, for instance.
//The console displays an error message.
if (web3) {
  instance = new web3.eth.Contract(
    Forwarder.abi,
    process.env.REACT_APP_FORWARDER_CONTRACT_ADDRESS
  );
}

export default instance;
