import React, { useState, useEffect } from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import { Message } from "semantic-ui-react";
import { Loader } from "../utils/loader";
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
import MemberInfo from "./member/MemberInfo";

function App() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isRinkebyNetwork, setIsRinkebyNetwork] = useState(false);
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    //async function inside useEffect since we cannot declare useEffect as "async".
    async function checkNetwork(validWallet) {
      if (validWallet) {
        const validNetwork = await checkRinkebyNetwork();
        console.log("Valid network : ", validNetwork);
        setIsRinkebyNetwork(validNetwork);
        //Listen if the network id changes. Reload the page for security.
        //See "chainChainged" section in https://docs.metamask.io/guide/ethereum-provider.html#events
        window.ethereum.on("chainChanged", (_chainId) =>
          window.location.reload()
        );
      }else {
        setIsRinkebyNetwork(false);
      }
    }

    //Check if MetaMask is installed.
    const validWallet = checkMetaMask();
    //If MetaMask is not installed we have to show the corresponding section
    //and disable the MetaMask connection button.
    setIsMetaMaskInstalled(validWallet);
    //If MetaMask is installed we have to check if the user it is connected to our application yet
    //using the Rinkeby Test Network.
    checkNetwork(validWallet)
  }, []);

  const metaMaskConnectionHandler = async () => {
    //Connect to MetaMask.
    setLoading(true);
    setErrorMessage("");
    //Check if we have the Rinkeby network.
    const success = await enableMetaMask();
    setIsMetaMaskConnected(success);
    if (!success) {
      setErrorMessage("No se ha podido conectar con MetaMask.");
    }

    setLoading(false);
  };

  return (
    <Layout
      disabled={!isMetaMaskInstalled || !isRinkebyNetwork}
      connected={isMetaMaskConnected}
      clicked={metaMaskConnectionHandler}
    >
      {errorMessage ? (
        <Message
          error
          header="Error en conexión con MetaMask"
          content={errorMessage}
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
              metaMaskInstalled={isMetaMaskInstalled}
              rinkebyNetwork={isRinkebyNetwork}
              metaMaskConnected={isMetaMaskConnected}
            />
          )}
        ></Route>
        {/*<Route exact path='/addmember' component={NewMember}></Route>*/}
        <Route
          exact
          path="/addmember"
          component={() => (
            <NewMember metaMaskConnected={isMetaMaskConnected} />
          )}
        ></Route>
        <Route
          exact
          path="/member/:id"
          component={() => (
            <MemberInfo metaMaskConnected={isMetaMaskConnected} />
          )}
        />
        {/* Redirect user to a specific page if the route does not exist. */}
        <Route component={NotFound} />
      </Switch>
      {/*Redirect to the main page if the MetaMask connection button is disabled */}
      {!isMetaMaskInstalled || !isRinkebyNetwork ? <Redirect to="/" /> : null}
      {loading ? <Loader></Loader> : null}
    </Layout>
  );
}

export default App;
