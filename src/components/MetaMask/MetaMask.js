import React from 'react';
import { Grid, Image, GridRow, Label } from 'semantic-ui-react'
import styles from './MetaMask.module.css';

const srcMetaMaskDownloadImg = '/images/download-metamask-button.png'
const srcInfoIcon = '/images/info-icon.svg'

const MetaMask = () => {
    return (
        <div className={styles.MetaMask}>
            <Label image>
                <img src={srcInfoIcon} />
                IMPORTANTE
            </Label>
            <Grid>
                <GridRow style={{marginTop: 20}}>
                    <Grid.Column width={10}>
                        <p>Para empezar a añadir personas a nuestra base de datos</p>
                        <p>antes debes instalar MetaMask en tu navegador si es la</p>
                        <p>primera vez que vas a utilizar este formulario.</p>
                    </Grid.Column>
                    <Grid.Column width={10} />
                </GridRow>
                <GridRow style={{marginTop: -20}}>
                    <Grid.Column width = {10}>
                        <a
                        className={styles.MetaMaskLink}
                        href="http://www.smart-ib.coop/"
                        target="_blank"
                        rel="noopener noreferrer">¿Qué es MetaMask y para qué lo necesito?</a>
                    </Grid.Column>
                    <Grid.Column width={10} />
                </GridRow>
                <GridRow>
                    <Grid.Column width={7}>
                        <Image
                        className= {styles.MetaMaskImg}
                        src={srcMetaMaskDownloadImg}
                        as='a'
                        size='small'
                        href="https://metamask.io/download.html"
                        target='_blank'
                        /> 
                    </Grid.Column>
                    <Grid.Column width={10} />
                </GridRow>
            </Grid>
        </div>

    );
};

export default MetaMask;
