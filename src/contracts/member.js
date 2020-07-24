import { getWeb3 } from './web3';
import Member from './build/Member.json';

const web3 = getWeb3();

export default (address) => {
	return new web3.eth.Contract (
		Member.abi,
		address
	);
};
