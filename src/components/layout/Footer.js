import React from 'react';
import styles from '../../assets/css/Footer.module.css'


export default () => {
    const srcGitHubImg = '/images/github-icon.svg';
    
    return(
        <div className = {styles.Footer}>            
            <span>
                <a
                    className={styles.FooterLink}
                    href="https://p2pmodels.eu/"
                    target="_blank"
                    rel="noopener noreferrer">
                    P2PModels
                </a>
                , 2020. 
            </span>
            <div style={{ display: "flex", justifyContent: 'center', alignItems: "center"}}>
                <img src={srcGitHubImg} alt=""/>
                <a
                    className={styles.FooterLink}
                    href="https://github.com/P2PModels"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{marginLeft: '10px'}}>
                    GitHub
                </a>
            </div>
        </div>
    );
};
