import Web3 from "web3";

let web3;

export function checkMetaMask() {
  if ((typeof window.ethereum !== 'undefined') && (window.ethereum.isMetaMask)) {
    return true;
  } else {
    return false;
  }
}

export async function enableMetaMask() {
  if (typeof window.ethereum !== "undefined") {
    //MetaMask is installed.
    //Launch the plugin:
    await window.ethereum.request({ method: "eth_requestAccounts" });
    return true;
  } else {
    return false;
  }
}

export async function checkRinkebyNetwork() {
  try {
    if (typeof window.ethereum !== "undefined") {
      web3 = getWeb3();
      const networkId = await web3.eth.net.getId();
      const isRinkeby = networkId === 4;
      if (isRinkeby) {
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function getWeb3() {
  //We obtain an instance of the web3:
  if (!web3) {
    web3 = new Web3(Web3.givenProvider);
    if (typeof window.ethereum !== "undefined") {
      //In  order to silence a console warning when page inspection.
      window.ethereum.autoRefreshOnNetworkChange = false;
    }
  }
  return web3;
}

export function getCurrentAccount() {
  try {
    if (typeof window.ethereum !== "undefined") {
      const currentAccount = window.ethereum.selectedAddress;
      console.log("Current address: " + currentAccount);
      return currentAccount;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
