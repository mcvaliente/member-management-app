const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
//compiled versions of the contracts
const compiledFactory = require('../src/contracts/build/MemberFactory.json');
const compiledMember = require('../src/contracts/build/Member.json');


let accounts; //List of 10 accounts provided by Ganache.
let factory; //Our contract: MemberFactory
let memberAddress;
let member; //our contract: Member

beforeEach( async () => {
	//Get a list of all accounts
	accounts = await web3.eth.getAccounts();
	console.log("Available accounts: " + accounts);
	//console.log(JSON.stringify(compiledFactory.abi));
	
	//MEMBER FACTORY
	//Use one of those accounts to deploy the MemberFactory contract and get the instance.
    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({data: '0x' + compiledFactory.evm.bytecode.object})
        .send({from: accounts[0], gas: '1000000'});

	//await factory.methods.createCampaign('100').send({
	//	from: accounts[0],
	//	gas: '1000000'
	//});

	//CAMPAIGN
	//const addresses = await factory.methods.getDeployedCampaigns().call();
	//campaignAddress = addresses[0];
	//Javascript representation of the Campaign instance that we have created through the campaign contract address.
	//campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);

	//factory.setProvider(provider);
	//member.setProvider(provider);


});

describe('Members',() => {

	it('deploys a factory and a member', () => {
		assert.ok(factory.options.address);
		console.log('==================================================================');
		console.log('Member factory address: ' + factory.options.address);
		console.log('==================================================================');
		//assert.ok(campaign.options.address);
	});

	it('grants an address in order to add new members', async () => {
        await member.methods.addGrantedUser(accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });

        const isGrantedUser = await member.methods.grantedUsers(accounts[1]).call(); //return true if it is recorded as a granted user.
        assert(isGrantedUser);
    });

});