import React from "react";
import MemberSearchBar from "../../../containers/member/MemberSearchBar";
import styles from '../../../assets/css/Members.module.css';

const MemberSearch = ( props ) => {   
    return (
        <div>
           <span className={styles.span}>¿Buscas un socio/a?</span>
           <MemberSearchBar metaMaskConnected = {props.metaMaskConnected} memberIdHandler={props.memberIdHandler}/>
        </div>
    );
};

export default MemberSearch;

