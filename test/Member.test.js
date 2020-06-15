const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
//compiled versions of the contract
const compiledMember = require('../src/contracts/Artifacts.json');


let accounts; //List of 10 accounts provided by Ganache.
let memberContract; //Our contract: Member

beforeEach( async () => {
	//Get a list of all accounts
	accounts = await web3.eth.getAccounts();
	console.log("Available accounts: " + accounts);
	
	//MEMBER
	//The deployment address of the Member.sol contract that we obtained in Remix.
	const address = "0xe085a0a0b36dA3adbBC98d1371c8AA7d132834c4";
	const from = accounts[0];
	const options = { from };
	//Use one of those accounts to get the instance.
	const name = "contracts/Member.sol:Member";
	const artifact = compiledMember.contracts[name];
	const abi = JSON.parse(artifact.abi);
	membercontract = new web3.eth.Contract(abi, address, options);
  
	//memberContract.setProvider(provider);


});

describe('Member Management',() => {

	it('Get Member contract', () => {
		//assert.ok(factory.options.address);
		console.log('==================================================================');
		console.log('Member address: ');
		console.log('==================================================================');
		//assert.ok(campaign.options.address);
	});


});