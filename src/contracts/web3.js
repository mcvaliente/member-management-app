import Web3 from 'web3'

export function checkMetaMask() {
    if (typeof window.ethereum !== 'undefined'){
        //MetaMask está instalado.
        //Tenemos un proveedor, pero ahora hay que comprobar si es MetaMask
        //pues es el único que reconocemos.
        if (window.ethereum.isMetaMask){
            return true;
        }else {
            return false;
        }
    }else {
        return false;
     }
}

export async function enableMetaMask() {
    if (typeof window.ethereum !== 'undefined'){
        await window.ethereum.enable();
        //New forthcoming web3 API.
        //await window.ethereum.request({ method: 'eth_requestAccounts'});
        return true;
    }else {
        return false;
    }
}

export async function checkRinkebyNetwork(){
    try {
        const web3 = getWeb3();
        const networkId = await web3.eth.net.getId();
        //El identificador de la red Rinkeby es el 4.
        const isRinkeby = (networkId === 4);
        if (isRinkeby){
          console.log ('OK - Rinkeby network selected.')
          return true;
        }else {
          console.log ('ERROR - Please, select Rinkeby network.')
          return false;
        }
      } catch (error) {
          console.error(error);
      }
    
}

export function getWeb3(){
    let web3;

    //We obtain an instance of the web3: 
    //First condition for ordinary browsers;
    //Second condition for Legacy Web browsers,
    //but we are not going to take into account 
    //the Standard Browser returning our Rinkeby
    //Infura link in the SMART API project.
    //In the new forthcoming web3 API window.web3
    //must be removed and only we could use window.ethereum.
   if (!web3) {
       web3 = new Web3(window.ethereum
                    || (window.web3 && window.web3.currentProvider));
                    //|| "wss://rinkeby.infura.io/ws/v3/91143daf5d0b469aba463c5085542585");
    }

    return web3;    
}
