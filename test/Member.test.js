const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
//compiled versions of the contracts
const compiledMember = require('../src/contracts/Member.json');


let accounts; //List of 10 accounts provided by Ganache.
let memberAddress;
let member; //our contract: Member

beforeEach( async () => {
	//Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    console.log("Available accounts: " + accounts);
	console.log(JSON.stringify(compiledMember.abi));


	//CAMPAIGN FACTORY
	//Use one of those accounts to deploy the CampaignFactory contract and get the instance.
	member = await new web3.eth.Contract(JSON.parse(compiledMember.abi))
		.deploy({data: '0x' + compiledMember.evm.bytecode.object})
        .send ({ from: accounts[0], gas: '1000000'})
    
    memberAddress = member.options.address;

	await factory.methods.createCampaign('100').send({
		from: accounts[0],
		gas: '1000000'
	});

	member.setProvider(provider);
});

describe('Members',() => {
	it('deploys a member', () => {
		assert.ok(memberAddress);
		console.log('==================================================================');
		console.log('Member address: ' + memberAddress);
		console.log('==================================================================');
	});
});