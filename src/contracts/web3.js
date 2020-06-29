import Web3 from 'web3'

export function checkMetaMask() {
    if (typeof window.ethereum !== 'undefined'){
        //MetaMask está instalado.
        return true;
    }else {
        return false;
    }
}