
import React, { Component } from 'react';
import Pdf from "../../assets/docs/MetaMaskCompleteGuide.pdf";
import styles from '../../assets/css/MetaMask.module.css';

class MetaMaskInfo extends Component {

    metaMaskInfoClickHandler() {
        window.open(Pdf);
    }
  
    render() { 
        return (
            <button className={styles.MetaMaskButtonLink} onClick={this.metaMaskInfoClickHandler}>
                {this.props.messageInfo}
            </button>
        );
    }
}
export default MetaMaskInfo;
