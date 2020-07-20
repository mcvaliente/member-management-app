import React from 'react';
import { Segment } from 'semantic-ui-react';
import styles from '../../assets/css/Footer.module.css'

export default () => {
    return(
        <div className={styles.Footer}>
            <Segment style={{background: '#56595A', color: '#ffffff'}}>UCM - P2PModels 2020</Segment>
        </div>
    );
};
