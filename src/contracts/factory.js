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
    "0xd8Acf5fF6d69b42bcBa3e6b79F73b153985308F1"
  );
}

export default instance;
