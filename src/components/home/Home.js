import React, { Component } from 'react';
import MetaMask from '../ethereum/MetaMask';
import Rinkeby from '../ethereum/Rinkeby';
import Members from '../members/Members';
import styles from '../../assets/css/Home.module.css';

class Home extends Component {

    render() {
        return (
            <div className={styles.Home}>
                <p>¡Hola!</p>
                <p>Gracias por ayudarnos a completar la información de las</p>
                <p>personas que formamos parte de Smart.</p>
                {this.props.metaMaskInstalled ? (this.props.rinkebyNetwork ? <Members metaMaskConnected = {this.props.metaMaskConnected} /> : <Rinkeby />) : <MetaMask />}
            </div>
        );  
    }
}

export default Home;