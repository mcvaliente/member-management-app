
import React, { Component } from 'react';
import Pdf from "../../assets/docs/UsingMetaMaskGuide.pdf";
import styles from '../../assets/css/MetaMask.module.css';

class MetaMaskInfo extends Component {

    metaMaskInfoClickHandler() {
        window.open(Pdf);
    }
  
    render() { 
        return (
            <button className={styles.MetaMaskButtonLink} onClick={this.metaMaskInfoClickHandler}>
                ¿Qué es MetaMask y para qué lo necesito?
            </button>
        );
    }
}
export default MetaMaskInfo;
