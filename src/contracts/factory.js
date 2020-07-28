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
    "0x8c7733fcD3E5EFaAd1c54d94b53bB80c08DdC9f5"
  );
}

export default instance;
