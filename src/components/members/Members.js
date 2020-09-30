import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { Divider } from 'semantic-ui-react';
import styles from '../../assets/css/Members.module.css';
import MemberSearch from "./member/MemberSearch";

//Using Hooks.
function Members (props) {

    const [memberId, setMemberId] = useState('');
    const [memberAddress, setMemberAddress] = useState('');
    const [memberInfoRedirect, setMemberInfoRedirect] = useState(false);

    const memberSearchHandler = (memberId, memberAddress) => {
        console.log("New member id to search: ", memberId);
        setMemberId(memberId);
        setMemberAddress(memberAddress);
        setMemberInfoRedirect(true);
    }
    
    if (memberInfoRedirect){
        return <Redirect to={`/member/${memberId}/${memberAddress}`}></Redirect>
    }

    return (
        <div className={styles.Members}>
            <span className={styles.span}>¿Quieres añadir a una nueva persona?</span>
            <Link to='/addmember'>
                <button className={styles.MembersButton} disabled = {!props.metaMaskConnected}>Añadir socio/a</button>
            </Link>
            <Divider />
            <MemberSearch metaMaskConnected = {props.metaMaskConnected}  memberIdHandler = {memberSearchHandler} />
        </div>
    );
};

export default Members;

