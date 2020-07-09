import web3 from './web3';
import MemberFactory from '../../build/MemberFactory.json';

const instance = new web3.eth.Contract (
	MemberFactory.abi,
	'0xB4CA3fbE5Db284F80f0A9c282D094E852F78e4D0'
);

export default instance;