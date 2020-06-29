import React from 'react'
import { Segment } from 'semantic-ui-react';
import styles from './Footer.module.css';

const srcSmartLogo = '/images/logo-smart.png'
const srcMetaMaskIcon = '/images/metamask-fox-icon.svg'

export default () => {
    return(
        <div className= {styles.footer}>
            <Segment>UCM - P2PModels</Segment>
       </div>
    );
};
