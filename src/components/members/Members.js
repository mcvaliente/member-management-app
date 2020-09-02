import React from "react";
import { Link } from "react-router-dom";
import { Divider } from 'semantic-ui-react';
import styles from '../../assets/css/Members.module.css';
import MemberSearch from "./member/MemberSearch";

//Using Hooks.
function Members (props) {
    return (
        <div className={styles.Members}>
            <span className={styles.span}>¿Quieres añadir a una nueva persona?</span>
            <Link to='/addmember'>
                <button className={styles.MembersButton} disabled = {!props.metaMaskConnected}>Añadir socio/a</button>
            </Link>
            <Divider />
            <MemberSearch metaMaskConnected = {props.metaMaskConnected} />
        </div>
    );
};

export default Members;

