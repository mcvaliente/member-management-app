import React from "react";
import MemberInfoSearchBar from "../../../containers/member/MemberInfoSearchBar";
import styles from '../../../assets/css/Members.module.css';

const MemberInfoSearch = ( props ) => {   
    return (
        <div>
           <span className={styles.span}>¿Buscas un socio/a?</span>
           <MemberInfoSearchBar metaMaskConnected = {props.metaMaskConnected} memberIdHandler={props.memberIdHandler}/>
        </div>
    );
};

export default MemberInfoSearch;

