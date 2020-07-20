import React from "react";
import { Link } from "react-router-dom";
import styles from '../../assets/css/Members.module.css';

const Members = ( props ) => {
    return (
        <div className={styles.Members}>
            <span className={styles.span}>¿Quieres añadir a una nueva persona?</span>
            <Link to='/addmember'>
                <button className={styles.NewMemberButton} disabled = {!props.metaMaskConnected}>Añadir socio/a</button>
            </Link>
        </div>
    );
};

export default Members;

