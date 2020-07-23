const path = require('path');
const solc = require('solc');
const fs = require ('fs-extra'); //similar to fs module but it has a couple of extra functions (removeSync and ensureDirSync).

const buildPath = path.resolve(__dirname, 'src/contracts/build');
fs.removeSync(buildPath);

const memberPath = path.resolve(__dirname, './contracts', 'Member.sol');
const source = fs.readFileSync(memberPath, 'utf8');

var input = {
    language: 'Solidity',
    sources: {
        'Member.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ "abi", "evm.bytecode"]
            }
        }
    }
}; 
console.log(JSON.parse(solc.compile(JSON.stringify(input))));
//The previous instruction is equivalent to:
//const output = JSON.parse(solc.compile(JSON.stringify(input)), 1);
const output = JSON.parse(solc.compile(JSON.stringify(input)), 1).contracts['Member.sol'];
console.log('Output: ' + output);

//create the build folder. First, check if it exists.
fs.ensureDirSync(buildPath);

for (let contract in output){
	fs.outputJsonSync(
		path.resolve(buildPath, contract + '.json'),
		output[contract]
	);
}
