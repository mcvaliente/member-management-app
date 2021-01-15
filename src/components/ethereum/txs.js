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
    name: 'Defender',
    version: '1',
    chainId: 4, //Rinkeby
    verifyingContract: ForwarderAddress,
  },
  primaryType: 'ForwardRequest',
  types: {
    EIP712Domain: EIP712DomainType,
    ForwardRequest: ForwardRequestType
  },
  message: {}
};

//Reference: https://github.com/OpenZeppelin/defender-example-metatx-relay/blob/7ae0dc38591f3c2210eb696c18360cde4d391703/app/src/eth/txs.js
export async function submit(memberId, memberDates, name, surname, email, memberLocation, occupations, ipfsApplicationFileId, ipfsAcceptanceFileId, provider, currentAccount) {
  
  const from = currentAccount;
  //const network = await provider.eth.net.getId();
  //e.g. (if selected Rinkeby in our MetaMask account) txs network: 4
  //console.log("txs network: ", network);

  // Get nonce for current signer
  //Get the number of transactions sent from this address. We add "pending" in order to 
  //include pending transactions. Then we obtain the nonce.
  //e.g. nonce: 243
  //NOTA: No sé si la dirección debería ser la del contrato del Forwarder y no la de from. Ya se verá
  //cuando termine de implementar la gestión de la transacción (depende de si lanzo una transacción desde
  //el contrato forwarder).
  const nonce = await provider.eth.getTransactionCount(from, "pending").then(nonce => nonce.toString());
  //console.log("nonce:" , nonce);

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
  const toSign = { ...TypedData, message: request };
  const signature = await provider.currentProvider.send('eth_signTypedData_v4', [from, JSON.stringify(toSign)]);
  console.log("Signature: ", signature);

  //Pending: Check that the user doesn't cancel the signature.

  // Send request to the server
  //const response = await fetch(RelayUrl, {
  //  method: 'POST', 
  //  headers: { 'Content-Type': 'application/json' },
  //  body: JSON.stringify({ ...request, signature })
  //}).then(r => r.json());
  const response = "Sent meta-transaction.";

  return response;
}