const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./src/contracts/build/MemberFactory.json');
const provider = new HDWalletProvider(
	'spot common confirm random harsh asset dynamic faith bronze endorse kind mouse',
	'https://rinkeby.infura.io/v3/91143daf5d0b469aba463c5085542585'
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
