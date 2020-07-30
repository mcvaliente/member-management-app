import React, { Component } from "react";
import MetaMask from "../ethereum/MetaMask";
import Rinkeby from "../ethereum/Rinkeby";
import Members from "../members/Members";
import styles from "../../assets/css/Home.module.css";
import { Grid } from "semantic-ui-react";

const srcLoginIllustration = "/images/login-illustration.svg";

class Home extends Component {
  render() {
    return (
      <div className={styles.Home}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <p>¡Hola!</p>
              <p>Gracias por ayudarnos a completar la información de las</p>
              <p>personas que formamos parte de Smart.</p>
              {this.props.metaMaskInstalled ? (
                this.props.rinkebyNetwork ? (
                  <Members metaMaskConnected={this.props.metaMaskConnected} />
                ) : (
                  <Rinkeby />
                )
              ) : (
                <MetaMask />
              )}
            </Grid.Column>
            <Grid.Column width={5} style={{ marginLeft: "50px" }}>
              <img alt="member-management-app" src={srcLoginIllustration}></img>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Home;
