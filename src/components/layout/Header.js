import React from 'react'
import { Image } from 'semantic-ui-react';
import styles from '../../assets/css/Header.module.css';

const srcSmartLogo = '/images/logo-smart.png'
const srcMetaMaskIcon = '/images/metamask-fox-icon.svg'

export default (props) => {
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
            <button id='btnMetaMaskConnect' className={props.disabled ? styles.headerButtonDisabled : styles.headerButton}>
                <Image className={styles.headerButtonImage}  src={srcMetaMaskIcon} spaced='right' />
               <span className={styles.headerButtonText}>Conectar con MetaMask</span>
             </button>

        </div>
    );
};
