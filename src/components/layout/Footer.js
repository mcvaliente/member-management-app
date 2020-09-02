import React from 'react';
import styles from '../../assets/css/Footer.module.css'
import { Image } from 'semantic-ui-react';


export default () => {
    const srcGitHubImg = '/images/github-icon.svg';
    
    return(
        <div className = {styles.Footer}>
            <a
                className={styles.FooterLink}
                href="https://p2pmodels.eu/"
                target="_blank"
                rel="noopener noreferrer"
                style={{marginLeft : 50}}>
                P2PModels
            </a>
            <span>, 2020. </span>
            <div className={styles.FooterInnerDiv}>
                <Image src={srcGitHubImg} avatar style={{marginRight: '10px'}} />
                <a
                    className={styles.FooterLink}
                    href="https://github.com/P2PModels"
                    target="_blank"
                    rel="noopener noreferrer">
                 GitHub
                </a>
            </div>

        </div>
    );
};
