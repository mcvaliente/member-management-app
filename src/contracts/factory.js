import { getWeb3 } from './web3';
import MemberFactory from './build/MemberFactory.json';

const web3 = getWeb3();
const instance = new web3.eth.Contract (
	MemberFactory.abi,
	'0x8c7733fcD3E5EFaAd1c54d94b53bB80c08DdC9f5'
);

export default instance;