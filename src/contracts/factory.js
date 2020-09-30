import { getWeb3 } from "./web3";
import MemberFactory from "./build/MemberFactory.json";

let instance;
const web3 = getWeb3();
//We have to check if web3 has a value.
//If we don't check it we don't obtain any
//output in the Microsoft Edge Browser, for instance.
//The console displays an error message.
if (web3) {
  instance = new web3.eth.Contract(
    MemberFactory.abi,
    "0x865d3d92DD42ca3B0Ba73879654A4306601FFD1F"
  );
}

export default instance;
