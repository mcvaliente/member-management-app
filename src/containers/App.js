import React, { Component } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import { Message } from 'semantic-ui-react';
import { Loader } from '../utils/smartloader';
import Layout from '../components/layout/Layout';
import { checkMetaMask, checkRinkebyNetwork, enableMetaMask } from '../contracts/web3';
import { Switch, Route } from "react-router-dom";
import NewMember from '../components/members/member/NewMember';
import Home from '../components/home/Home';
import NotFound from './NotFound';

class App extends Component { 

  state = {
    isMetaMaskInstalled: false,
    isRinkebyNetwork: false,
    isMetaMaskConnected: false,
    loading: false,
    errorMessage: ''
  };

  async componentDidMount() {
    //Check if MetaMask is installed.
    const isMetaMaskInstalled = checkMetaMask();
    //If MetaMask is not installed we have to show the corresponding section
    //and disable the MetaMask connection button.
    //This instruction is equivalent to: this.setState({ isMetaMaskInstalled : isMetaMaskInstalled });
    this.setState({ isMetaMaskInstalled });
    //If MetaMask is installed we have to check if the Ethereum Tesnet Rinkeby network is selected 
    //in the MetaMask user account.
    if (isMetaMaskInstalled){
      const isRinkebyNetwork = await checkRinkebyNetwork();
      this.setState({ isRinkebyNetwork });
    }

    //We check that we have the MetaMask provider enabled.
    if (typeof window.ethereum !== 'undefined'){
      
      window.ethereum.autoRefreshOnNetworkChange = false;

      window.ethereum.on('accountsChanged', (accounts) => {
        // Handle the new accounts, or lack thereof.
        // "accounts" will always be an array, but it can be empty.
        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts.
          this.setState ({ isRinkebyNetwork : false, metaMaskConnected: false, errorMessage : "Por favor, conéctate a una cuenta de MetaMask y selecciona la red Rinkeby para la correcta ejecución de la aplicación."});
        }else {
          //Check first if we have the Rinkeby network selected:
          const isRinkeby = checkRinkebyNetwork();
          this.setState ({ isRinkebyNetwork : isRinkeby, metaMaskConnected: true, errorMessage : ''});
         
        }
      });
      
      //If the newtwork changes then display an alert if the network is not the Rinkeby network.
      window.ethereum.on('chainChanged', (chainId) => {
        // Handle the new chain.
        console.log("netid: " + chainId);
        if (chainId !== '0x4'){
          this.setState ({ isRinkebyNetwork : false, isMetaMaskConnected : false, errorMessage : "Por favor, seleccionar la Red Rinkeby en MetaMask para la correcta ejecución de la aplicación."});
          // Correctly handling chain changes can be complicated.
          // We recommend reloading the page unless you have a very good reason not to.
          //window.location.reload();
        } else {
          this.setState({isRinkebyNetwork : true, isMetaMaskConnected: true, errorMessage : '' });
        }
      });
    }
  }

  componentWillUnmount(){
    window.removeEventListener('chainChanged');
    window.removeEventListener('accountsChanged');
  }

  metaMaskConnectionHandler = async () => {
    //Connect to MetaMask.
    this.setState({ loading : true, errorMessage : '' });

    try {
        const success = await enableMetaMask();
        if (success){
            console.log("Conectado a MetaMask");
            this.setState({isMetaMaskConnected: true });
        }else {
            console.log("No conectado a MetaMask");
            this.setState({isMetaMaskConnected : false, errorMessage : "No se ha podido conectar con MetaMask." });
        }
    }catch (err){
        console.log(err.message);
        this.setState({ isMetaMaskConnected:false, errorMessage : err.message });
    }

    this.setState({ loading : false });
  }

  render() {
    return (
      <Layout disabled = {!this.state.isMetaMaskInstalled || !this.state.isRinkebyNetwork} connected = { this.state.isMetaMaskConnected } clicked={this.metaMaskConnectionHandler}>
        {this.state.errorMessage ? <Message error header = "Error en conexión con MetaMask" content = {this.state.errorMessage}/> : null}
        <Switch> {/* The Switch decides which component to show based on the current URL.*/}
            <Route exact path='/' component={() => <Home metaMaskInstalled={this.state.isMetaMaskInstalled} rinkebyNetwork={this.state.isRinkebyNetwork}  metaMaskConnected = {this.state.isMetaMaskConnected}/>}></Route>
            {/*<Route exact path='/addmember' component={NewMember}></Route>*/}
            <Route exact path='/addmember' component={() => <NewMember metaMaskConnected={this.state.isMetaMaskConnected} />}></Route>
            {/* Redirect user to Page 404 if route does not exist. */}
            <Route component={NotFound} />
        </Switch>
        {this.state.loading ? <Loader></Loader> : null}
      </Layout>
    );  
  }
}

export default App;