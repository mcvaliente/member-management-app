import React, { Component } from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import { Message } from "semantic-ui-react";
import { Loader } from "../utils/smartloader";
import Layout from "../components/layout/Layout";
import {
  checkMetaMask,
  checkRinkebyNetwork,
  enableMetaMask,
} from "../contracts/web3";
import { Switch, Route, Redirect } from "react-router-dom";
import NewMember from "../containers/member/NewMember";
import Home from "../components/home/Home";
import NotFound from "../components/error/NotFound";

class App extends Component {
  state = {
    isMetaMaskInstalled: false,
    isRinkebyNetwork: false,
    isMetaMaskConnected: false,
    loading: false,
    errorMessage: "",
  };

  async componentDidMount() {
    //Check if MetaMask is installed.
    const isMetaMaskInstalled = checkMetaMask();
    //If MetaMask is not installed we have to show the corresponding section
    //and disable the MetaMask connection button.
    //This instruction is equivalent to: this.setState({ isMetaMaskInstalled : isMetaMaskInstalled });
    this.setState({ isMetaMaskInstalled });
    //If MetaMask is installed we have to check if the user it is connected to our application yet
    //using the Rinkeby Test Network.
    if (isMetaMaskInstalled) {
      const isRinkebyNetwork = await checkRinkebyNetwork();
      this.setState({ isRinkebyNetwork });
    }
  }

  metaMaskConnectionHandler = async () => {
    //Connect to MetaMask.
    this.setState({ loading: true, errorMessage: "" });

    try {
      const success = await enableMetaMask();
      if (success) {
        console.log("Conectado a MetaMask");
        this.setState({ isMetaMaskConnected: true });
      } else {
        console.log("No conectado a MetaMask");
        this.setState({
          isMetaMaskConnected: false,
          errorMessage: "No se ha podido conectar con MetaMask.",
        });
      }
    } catch (err) {
      console.log(err.message);
      this.setState({ isMetaMaskConnected: false, errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout
        disabled={
          !this.state.isMetaMaskInstalled || !this.state.isRinkebyNetwork
        }
        connected={this.state.isMetaMaskConnected}
        clicked={this.metaMaskConnectionHandler}
      >
        {this.state.errorMessage ? (
          <Message
            error
            header="Error en conexión con MetaMask"
            content={this.state.errorMessage}
          />
        ) : null}
        <Switch>
          {" "}
          {/* The Switch decides which component to show based on the current URL.*/}
          <Route
            exact
            path="/"
            component={() => (
              <Home
                metaMaskInstalled={this.state.isMetaMaskInstalled}
                rinkebyNetwork={this.state.isRinkebyNetwork}
                metaMaskConnected={this.state.isMetaMaskConnected}
              />
            )}
          ></Route>
          {/*<Route exact path='/addmember' component={NewMember}></Route>*/}
          <Route
            exact
            path="/addmember"
            component={() => (
              <NewMember metaMaskConnected={this.state.isMetaMaskConnected} />
            )}
          ></Route>
          {/* Redirect user to Page 404 if route does not exist. */}
          <Route component={NotFound} />
        </Switch>
        {!this.state.isMetaMaskInstalled ? <Redirect to="/" /> : null}
        {this.state.loading ? <Loader></Loader> : null}
      </Layout>
    );
  }
}

export default App;
