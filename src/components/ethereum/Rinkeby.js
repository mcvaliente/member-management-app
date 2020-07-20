import React from "react";
import { Grid, GridRow, Label } from 'semantic-ui-react'
import styles from '../../assets/css/Rinkeby.module.css';
import MetaMaskInfo from '../ethereum/MetaMaskInfo';

const srcInfoIcon = '/images/info-icon.svg'

const Rinkeby = () => {
    return (
        <div className={styles.Rinkeby}>
            <Label image>
                <img alt='warning' src={srcInfoIcon} />
                IMPORTANTE
            </Label>
            <Grid>
                <GridRow style={{marginTop: 20}}>
                    <Grid.Column width={10}>
                        <p>Para empezar a añadir personas a nuestra base de datos</p>
                        <p>antes debes seleccionar la red Rinkeby desde tu cuenta</p>
                        <p>de MetaMask.</p>
                    </Grid.Column>
                    <Grid.Column width={10} />
                </GridRow>
                <GridRow style={{marginTop: -20}}>
                    <Grid.Column width = {10}>
                        <MetaMaskInfo messageInfo= '¿Qué es MetaMask y para qué lo necesito?'/>
                    </Grid.Column>
                    <Grid.Column width={10} />
                </GridRow>
            </Grid>
        </div>

    );
};

export default Rinkeby;
