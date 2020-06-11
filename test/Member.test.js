const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
//compiled versions of the contracts
const compiledMember = require('../src/contracts/build/Member.json');

let accounts; //List of 10 accounts provided by Ganache.

beforeEach( async () => {
	//Get a list of all accounts
	accounts = await web3.eth.getAccounts();
	console.log("Available accounts: " + accounts);
	console.log(JSON.stringify(compiledMember.abi));
	
	//MEMBER
	//Use one of those accounts to deploy the Member contract and get the instance.
    member = await new web3.eth.Contract(compiledMember.abi)
        .deploy({data: '0x' + compiledMember.evm.bytecode.object})
        .send({from: accounts[0], gas: '1000000'});


	member.setProvider(provider);


});

describe('Campaigns',() => {

	it('deploys Member contract', () => {
		//assert.ok(factory.options.address);
		console.log('==================================================================');
		console.log('Campaign address: ');
		console.log('==================================================================');
		//assert.ok(campaign.options.address);
	});


});