import web3 from './web3';
import Member from '../build/Member.json';

export default (address) => {
	return new web3.eth.Contract (
		Member.abi,
		address
	);
};
