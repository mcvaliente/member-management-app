const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./src/contracts/build/MemberFactory.json');
const provider = new HDWalletProvider(
	'<<secret-backup-phrase>>',
	'<<infura-link>>'
	);
const web3 = new Web3(provider);

//Implement the deploy function.
const deploy = async () => {

	const accounts = await web3.eth.getAccounts();

	console.log ('Attempting to deploy from account', accounts[0]);

	//Deploy the contract.
	const result = await new web3.eth.Contract(compiledFactory.abi)	
    	.deploy({data: '0x' + compiledFactory.evm.bytecode.object})
    	.send({ from: accounts[0] });

    console.log ('Contract deployed to', result.options.address);
};

//Invoke the deploy function.
deploy();
