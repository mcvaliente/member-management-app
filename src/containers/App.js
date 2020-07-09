import React, { Component } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import { Message } from 'semantic-ui-react';
import Layout from '../components/layout/Layout';
import { checkMetaMask, checkRinkebyNetwork, enableMetaMask } from '../contracts/web3';
import { Switch, Route } from "react-router-dom";
import NewMember from '../components/members/member/NewMember';
import Home from '../components/home/Home';
import NotFound from './NotFound';

class App extends Component { 

  state = {
    metaMaskDisabled: false,
    showMetaMaskSection: false,
    showRinkebySection: false,
    isMetaMaskConnected: false,
    loading: false,
    errorMessage: '',
    reloadInterface: false
  };

  async componentDidMount() {
    //Check if MetaMask is installed.
    const isMetaMaskInstalled = checkMetaMask();
    //If MetaMask is not installed we have to show the corresponding section
    //and disable the MetaMask connection button.  
    this.setState({ showMetaMaskSection : !isMetaMaskInstalled, metaMaskDisabled: !isMetaMaskInstalled });
    //If MetaMask is installed we have to check if the Ethereum Tesnet Rinkeby network is selected 
    //in the MetaMask user account.
    if (isMetaMaskInstalled){
      const isRinkebyNetwork = await checkRinkebyNetwork();
      this.setState({ showRinkebySection : !isRinkebyNetwork, metaMaskDisabled: !isRinkebyNetwork });
    }

    //We check that we have the MetaMask provider enabled.
    if (typeof window.ethereum !== 'undefined'){
      window.ethereum.on('accountsChanged', function (accounts) {
        // Reload the page.
        //window.location.reload(false);
        this.setState({ reloadInterface : true});
      });
  
      window.ethereum.on('networkChanged', function (netId) {
        // Reload the page.
        //window.location.reload(false);
        this.setState({ reloadInterface : true});
      });      
    }
  }

  metaMaskConnectionHandler = async () => {
    //Connect to MetaMask.
    this.setState({ loading : true, errorMessage : '' });

    try {
        const success = await enableMetaMask();
        if (success){
            console.log("Conectado a MetaMask");
            this.setState({isMetaMaskConnected: true});
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
      <Layout disabled =  {this.state.metaMaskDisabled} connected = { this.state.isMetaMaskConnected } clicked={this.metaMaskConnectionHandler}>
        {this.state.loading ? <Message content = "Realizando conexión con MetaMask..."/> : null}
        {this.state.errorMessage ? <Message error header = "Error en conexión con MetaMask" content = {this.state.errorMessage}/> : null}
        <Switch> {/* The Switch decides which component to show based on the current URL.*/}
            <Route exact path='/' component={() => <Home showMetaMaskSection={this.state.showMetaMaskSection} showRinkebySection={this.state.showRinkebySection}  MetaMaskConnected = {this.state.isMetaMaskConnected}/>}></Route>
            <Route exact path='/addmember' component={NewMember}></Route>
            {/* Redirect user to Page 404 if route does not exist. */}
            <Route component={NotFound} />
        </Switch>
      </Layout>
    );  
  }
}

export default App;