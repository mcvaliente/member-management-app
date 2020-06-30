import React, { Component } from 'react';
import './App.css';
import Layout from '../components/layout/Layout';
import 'semantic-ui-css/semantic.min.css'
import { checkMetaMask } from '../contracts/web3';
import MetaMask from '../components/metamask/MetaMask';

class App extends Component {
  state = {
    metaMaskDisabled: false,
    showMetaMaskSection: false

  };

  async componentDidMount() {
    //En primer lugar comprobar si tenemos MetaMask instalado.
    const isMetaMaskInstalled = checkMetaMask();
    //Si no está instalado actualizamos la variable correspondiente para
    //que muestre la sección y habilite o inhabilite el botón para conectarse con MetaMask.
    this.setState({ showMetaMaskSection : !isMetaMaskInstalled, metaMaskDisabled: !isMetaMaskInstalled });
  }

  render() {
    return (
      <Layout disabled =  {this.state.metaMaskDisabled}>
        <div className="App">
            <p>¡Hola!</p>
            <p>Gracias por ayudarnos a completar la información de las</p>
            <p>personas que formamos parte de Smart.</p>
            {this.state.showMetaMaskSection ? <MetaMask />  : null}
        </div>
      </Layout>
    );  
  }
}

export default App;