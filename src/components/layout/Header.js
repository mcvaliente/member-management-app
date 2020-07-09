import React from 'react'
import { Image } from 'semantic-ui-react';
import styles from '../../assets/css/Header.module.css';

const srcSmartLogo = '/images/logo-smart.png';
const srcMetaMaskIcon = '/images/metamask-fox-icon.svg';

const Header = ( props ) => {

    return(
        <div className={styles.header}>
            <Image
                src={srcSmartLogo}
                as='a'
                size='small'
                href="http://www.smart-ib.coop/"
                target='_blank'
                spaced = "right"
            /> 
            <span className={styles.headerTitle}>Alta para personas socias</span>
            <span className={styles.headerSubtitle} >BETA 1.O</span>
            {props.connected ? 
                <button id='btnMetaMaskConnected' className={styles.headerButtonConnected} disabled>
                    <Image className={styles.headerButtonImage}  src={srcMetaMaskIcon} spaced='right' />
                    <span className={styles.headerButtonText}>Connectado a MetaMask</span>
                </button>
                :
                <button id='btnMetaMaskConnect' className={styles.headerButton} onClick={ props.clicked } disabled = { props.disabled}>
                    <Image className={styles.headerButtonImage}  src={srcMetaMaskIcon} spaced='right' />
                    <span className={styles.headerButtonText}>Conectar con MetaMask</span>
                </button>
            }
        </div>
    );    
};

export default Header;
