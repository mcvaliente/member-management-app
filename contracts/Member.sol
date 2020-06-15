// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.7.0;

contract Member {

    ////////////////////////////////////////////////
    //MEMBER SECTION
    ////////////////////////////////////////////////
    struct MemberInfo {
        string name;
        string surname;
        bytes32 birthdate; //dd/mm/aaaa
        bytes32 acceptanceDate; //dd/mm/aaaa
        uint totalOccupations;
        mapping (uint => string) occupations;
        bool exists;
    }

    struct MemberLocation {
        string office;
        string county;
        string country;
    }

    mapping (bytes32 => MemberInfo) public members;
    mapping (bytes32 => MemberLocation) public membersLocation;
    bytes32[] public memberList;

    modifier existing(bytes32 memberId){
        require(
            members[memberId].exists,
            "ERROR_MEMBER_NOT_FOUND."
        );
        _;
    }

    ////////////////////////////////////////////////
    //GRANTED USERS SECTION
    ////////////////////////////////////////////////

    //Address that deploys the contract (i.e., the owner of the contract).
    address public owner;
    mapping (address => bool) public grantedUsers;

    modifier onlyOwner(address userAccount){
        require(
            owner == userAccount,
            "ERROR_UNATHORIZED_ADMIN_TASK."
        );
        _;
    }

    modifier restricted(address userAccount){
        require(
            grantedUsers[userAccount],
            "ERROR_UNATHORIZED_USER_OPERATION."
        );
        _;
    }

    constructor () public{
        owner = msg.sender;
    }

    function createMember(bytes32 memberId, string memory name, string memory surname,
                            bytes32 birthdate, bytes32 acceptanceDate) public restricted (msg.sender) {

        //Check the member doesn't exist.
        require(!members[memberId].exists,
                "ERROR_MEMBERID_EXISTS"
        );

        MemberInfo memory newMember = MemberInfo({
            name: name,
            surname: surname,
            birthdate: birthdate,
            acceptanceDate: acceptanceDate,
            totalOccupations: 0,
            exists: true
        });
        members[memberId] = newMember;

        //Since we cannot manage members as a List, we need the next property to get to total number of members.
        memberList.push(memberId);

    }

    function addMemberOccupation(bytes32 memberId, string memory occupation) public existing(memberId) restricted (msg.sender) {
        uint occupationNumber = members[memberId].totalOccupations;
        members[memberId].occupations[occupationNumber] = occupation;
        members[memberId].totalOccupations = occupationNumber + 1;
    }

    function addMemberLocation(bytes32 memberId, string memory county, string memory office, string memory country)
                                public existing(memberId) restricted (msg.sender) {

        MemberLocation memory newMemberLocation = MemberLocation({
            county: county,
            office: office,
            country:country
        });
        membersLocation[memberId] = newMemberLocation;
    }

    function getMembersCount() public view returns (uint) {
        return memberList.length;
    }

    function getMemberOccupation(bytes32 memberId, uint occupationIndex) public existing(memberId) view returns (string memory) {
        return members[memberId].occupations[occupationIndex];
    }

    function getMemberLocation(bytes32 memberId) public existing(memberId) view returns (string memory, string memory, string memory ) {
        return (
            membersLocation[memberId].office,
            membersLocation[memberId].county,
            membersLocation[memberId].country
        );
    }

    //These functions will be invoked only by the creator of the contract and it is cannot
    //be an option of the SmartCoopChain's DApp for adding new members.
    function addGrantedUser(address userAccount) public  onlyOwner (msg.sender){
        grantedUsers[userAccount] = true;
    }

    function revokeGrantedUser(address userAccount) public onlyOwner (msg.sender) {
        grantedUsers[userAccount] = false;
    }

}
