import React from "react";
import { Link } from "react-router-dom";
import { Divider } from 'semantic-ui-react';
import SearchMemberBar from '../../containers/member/SearchMemberBar';
import styles from '../../assets/css/Members.module.css';

const Members = ( props ) => {
    return (
        <div className={styles.Members}>
            <span className={styles.span}>¿Quieres añadir a una nueva persona?</span>
            <Link to='/addmember'>
                <button className={styles.NewMemberButton} disabled = {!props.metaMaskConnected}>Añadir socio/a</button>
            </Link>
            <Divider />
            <span className={styles.span}>¿Buscas un socio/a?</span>
            <SearchMemberBar metaMaskConnected = {props.metaMaskConnected} />
        </div>
    );
};

export default Members;

