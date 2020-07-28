import React from "react";
import { Image, Grid } from "semantic-ui-react";
import MetaMaskInfo from "../ethereum/MetaMaskInfo";
import styles from "../../assets/css/Header.module.css";

const srcSmartLogo = "/images/logo-smart.png";
const srcMetaMaskIcon = "/images/metamask-fox-icon.svg";

const Header = (props) => {
  return (
    <div className={styles.header}>
      <Grid>
        <Grid.Column width={10}>
          <Image
            src={srcSmartLogo}
            as="a"
            size="small"
            href="http://www.smart-ib.coop/"
            target="_blank"
            spaced="right"
          />
          <span className={styles.headerTitle}>Alta para personas socias</span>
          <span className={styles.headerSubtitle}>BETA 1.O</span>
        </Grid.Column>
        {props.disabled ? null : (
          <Grid.Column
            width={2}
            floated="right"
            style={{ marginTop: 20, marginRight: 20, textAlign: "right" }}
          >
            <MetaMaskInfo messageInfo="¿Tienes dudas?" />
          </Grid.Column>
        )}
        {props.connected ? (
          <Grid.Column floated="right" width={2}>
            <button
              id="btnMetaMaskConnected"
              className={styles.headerButtonConnected}
              disabled
            >
              <Image
                className={styles.headerButtonImage}
                src={srcMetaMaskIcon}
                spaced="right"
              />
              <span className={styles.headerButtonTextConnected}>
                Conectado a MetaMask
              </span>
            </button>
          </Grid.Column>
        ) : (
          <Grid.Column floated="right" width={2}>
            <button
              id="btnMetaMaskConnect"
              className={styles.headerButton}
              onClick={props.clicked}
              disabled={props.disabled}
            >
              <Image
                className={styles.headerButtonImage}
                src={srcMetaMaskIcon}
                spaced="right"
              />
              <span className={styles.headerButtonText}>
                Conectar con MetaMask
              </span>
            </button>
          </Grid.Column>
        )}
      </Grid>
    </div>
  );
};

export default Header;
