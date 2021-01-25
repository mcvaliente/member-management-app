import factory from "../../contracts/factory";

const ZeroAddress = '0x0000000000000000000000000000000000000000';
const MemberAddress = process.env.REACT_APP_MEMBER_CONTRACT_ADDRESS || ZeroAddress;
const ForwarderAddress = process.env.REACT_APP_FORWARDER_CONTRACT_ADDRESS || ZeroAddress;
const RelayUrl = process.env.REACT_APP_RELAY_URL || '/relay';

const EIP712DomainType = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' }
]

const ForwardRequestType = [
  { name: 'from', type: 'address' },
  { name: 'to', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'gas', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'data', type: 'bytes' }
]

const TypedData = {
  domain: {
    name: 'Wallet manager',
    version: '1',
    chainId: process.env.REACT_APP_CHAIN_ID, //4 - Rinkeby
    verifyingContract: ForwarderAddress
  },
  primaryType: 'ForwardRequest',
  types: {
    EIP712Domain: EIP712DomainType,
    ForwardRequest: ForwardRequestType
  },
  message: {}
};

//Reference: https://github.com/OpenZeppelin/defender-example-metatx-relay/blob/7ae0dc38591f3c2210eb696c18360cde4d391703/app/src/eth/txs.js
export async function submit(memberId, memberDates, name, surname, email, memberLocation, occupations, ipfsApplicationFileId, ipfsAcceptanceFileId, web3, from) {
  
  //const network = await web3.eth.net.getId();
  //e.g. (if selected Rinkeby in our MetaMask account) txs network: 4
  //console.log("txs network: ", network);

  // Get nonce for current signer
  //Get the number of transactions sent from this address. We add "pending" in order to 
  //include pending transactions. Then we obtain the nonce.
  //e.g. nonce: 243
  //NOTA: No sé si la dirección debería ser la del contrato del Forwarder y no la de from. Ya se verá
  //cuando termine de implementar la gestión de la transacción (depende de si lanzo una transacción desde
  //el contrato forwarder).
  const nonce = await web3.eth.getTransactionCount(from, "pending").then(nonce => nonce.toString());
  //console.log("nonce:" , nonce);

  console.log ("Chain id: ", process.env.REACT_APP_CHAIN_ID);
  console.log("Member contract address: ", process.env.REACT_APP_FORWARDER_CONTRACT_ADDRESS);

  // Encode meta-tx request
  const data = factory.methods.createMember(
      memberId,
      memberDates,
      name,
      surname,
      email,
      memberLocation,
      occupations,
      ipfsApplicationFileId,
      ipfsAcceptanceFileId
    ).encodeABI();
  console.log("Encode ABI (data): ", data);
  const request = {
    from,
    to: MemberAddress,
    value: 0,
    gas: 2e6,
    nonce,
    data
  };

  // Get the signature
  let response;
  const toSign = { ...TypedData, message: request };
  //const signature = await web3.currentProvider.send('eth_signTypedData_v4', [from, JSON.stringify(toSign)]);
  //console.log("Signature: ", signature);
  const params = [from, JSON.stringify(toSign)];
  let signature;
  let validSignature = true;
  await web3.currentProvider
  .request({
    method: 'eth_signTypedData_v4',
    params,
  })
  .then((result) => {
    // The result varies by RPC method.
    // For example, this method will return a transaction hash hexadecimal string on success.
    signature = result;
    console.log('Signature:' + signature);
  })
  .catch((error) => {
    // If the request fails, the Promise will reject with an error.
    validSignature = false;
    if (error.code === 4001) {
      //MetaMask Message Signature: User denied message signature
      response = {
        error : "Por favor, firma la transacción para que la operación se te pueda realizar sin coste alguno."
      };
    }
    else {
      response = {
        error : error.message
      };
    }    
    console.log("Signature failure: ", error.message);
  });

  if (validSignature){
    // Send request to the server
    response = await fetch(RelayUrl, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...request, signature })
    }).then(r => r.json());
    console.log("Response server: ", JSON.stringify(response));
  }

  return response;
  
}
