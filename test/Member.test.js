const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
//compiled versions of the contracts
const compiledFactory = require('../build/MemberFactory.json');
const compiledMember = require('../build/Member.json');


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
	//In order to deploy we must take into account the gas that we are using.
	//In this case we need 200000 instead of 1000000 as in the CampaignFactory example.
    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({data: '0x' + compiledFactory.evm.bytecode.object})
        .send({from: accounts[0], gas: '2000000'});

	await factory.methods.createMember().send({
		from: accounts[0],
		gas: '2000000'
	});

	//MEMBER
	const addresses = await factory.methods.getDeployedMembers().call();
	memberAddress = addresses[0];
	//Javascript representation of the Campaign instance that we have created through the campaign contract address.
	member = await new web3.eth.Contract(compiledMember.abi, memberAddress);

	factory.setProvider(provider);
	member.setProvider(provider);


});

describe('Members',() => {

	it('deploys a factory and a member', () => {
		assert.ok(factory.options.address);
		console.log('==================================================================');
		console.log('Member address: ' + member.options.address);
		console.log('==================================================================');
		assert.ok(member.options.address);
	});

	it('grants an address in order to add new members', async () => {
        await member.methods.addGrantedUser(accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });

        const isGrantedUser = await member.methods.isGrantedUser(accounts[1]).call(); //return true if it is recorded as a granted user.
        assert(isGrantedUser);
	});
	
	it('checks that an user is not granted for adding members', async () => {
        const isGrantedUser = await member.methods.isGrantedUser(accounts[0]).call(); //return true if it is recorded as a granted user.
        assert(!isGrantedUser);
	});

	it('adds the basic information of a new member', async () =>  {

		try {
			await member.methods.addMemberBasicInformation(web3.fromAscii('52860696A'), 'María-Cruz', 'Valiente', web3.fromAscii('23/12/1972'), web3.fromAscii('04/05/2020')).send({ 
				from: accounts[1]
			 });
			 const memberInfo = await member.getMemberSummary().call();
			 assert('52860696A', web3.toAscii(memberInfo.surname));
		} catch (err){
			assert.ok(err);
		}
	});

});