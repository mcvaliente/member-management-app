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
	memberId = await web3.utils.fromAscii('70006672P');
	
	//MEMBER FACTORY
	//Use one of those accounts to deploy the MemberFactory contract and get the instance.
	//In order to deploy we must take into account the gas that we are using.
	//In this case we need 200000 instead of 1000000 as in the CampaignFactory example.
    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({data: '0x' + compiledFactory.evm.bytecode.object})
        .send({from: accounts[0], gas: '2000000'});

	await factory.methods.createMember(memberId).send({
		from: accounts[0],
		gas: '2000000'
	});

	//MEMBER
	const addresses = await factory.methods.getDeployedMembers().call();
	memberAddress = addresses[0];
	console.log("Member address from deployed members: ", memberAddress)
	//Javascript representation of the Member instance that we have created through the member contract address.
	member = await new web3.eth.Contract(compiledMember.abi, memberAddress);

	//Member from the mapping id => address
	const mappingMemberAddress = await factory.methods.getMemberAddress(memberId).call();
	console.log("Member address from mapping: ", mappingMemberAddress);

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

	it('adds the basic information of a new member', async () =>  {

		try {
			await member.methods.addMemberBasicInformation(web3.utils.fromAscii('70006672P'), 'Sofía', 'Alonso Soria', web3.utils.fromAscii('11/03/1991'), web3.utils.fromAscii('04/06/2020')).send({ 
				from: accounts[0],
				gas: '2000000'
			});
			const memberInfo = await member.methods.getMemberSummary().call();
			console.log("Member info", memberInfo);
			const output = '[' + JSON.stringify(memberInfo) + ']';
			const jsonOutput = JSON.parse(output);
			for (var i = 0; i < jsonOutput.length; i++)
			{
				console.log("NIF/NIE: ", web3.utils.toAscii(jsonOutput[i]['0']));
			}
			assert(web3.utils.fromAscii('70006672P'), memberInfo.memberId);
		} catch (err){
			console.log("Catched exception: ", err);
			assert.ok(err);
		}
	});

	it('fails trying to insert the basic information of a new member because it is not the owner', async () =>  {

		try {
			await member.methods.addMemberBasicInformation(web3.utils.fromAscii('70006672P'), 'Sofía', 'Alonso Soria', web3.utils.fromAscii('11/03/1991'), web3.utils.fromAscii('04/06/2020')).send({ 
				from: accounts[1]
			 });
			 const memberInfo = await member.getMemberSummary().call();
			 assert('Alonso Soria', memberInfo.surname);
			 assert('70006672P', web3.utils.toAscii(memberInfo.memberId));
		} catch (err){
			console.log("Catched exception: ", err);
			assert.ok(err);
		}
	});

	it('adds the location of a new member', async () =>  {

		try {
			await member.methods.addMemberLocation('Soria', 'Madrid', 'España').send({ 
				from: accounts[0]
			 });
			 const memberLocation = await member.methods.getMemberLocation().call();
			 assert('España', memberLocation.country);
		} catch (err){
			console.log("Catched exception: ", err);
			assert.ok(err);
		}
	});
});
