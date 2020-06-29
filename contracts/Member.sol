// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.7.0;

contract MemberFactory {

    Member[] private deployedMembers;

    function createMember() public {
        Member newMember = new Member(msg.sender);
        deployedMembers.push(newMember);
    }

    function getDeployedMembers() public view returns (Member[] memory) {
        return deployedMembers;
    }

    function getMemberCount() public view returns (uint){
        return deployedMembers.length;
    }

}

contract Ownable {

    //Address that deploys the contract (i.e., the owner of the contract).
    address owner;
    mapping (address => bool) grantedUsers;

    modifier onlyOwner(address userAccount){
        require(
            owner == userAccount,
            "ERROR_NOT_OWNER."
        );
        _;
    }

    modifier restricted(address userAccount){
        require(
            grantedUsers[userAccount],
            "ERROR_NOT_GRANTED_USER."
        );
        _;
    }

    function addGrantedUser(address userAccount) public  onlyOwner(msg.sender) {
        grantedUsers[userAccount] = true;
    }

    function revokeGrantedUser(address userAccount) public onlyOwner(msg.sender) {
        grantedUsers[userAccount] = false;
    }

    function isGrantedUser (address userAccount) public view returns(bool){
        return (grantedUsers[userAccount]);
    }

}

contract Member is Ownable {

    struct BasicInfo {
        bytes32 memberId; //NIF/NIE
        string name;
        string surname;
        bytes32 birthdate; //dd/mm/aaaa
        bytes32 acceptanceDate; //dd/mm/aaaa
        uint totalOccupations;
        mapping (uint => string) occupations;
    }

    struct LocationInfo {
        string office;
        string county;
        string country;
    }

    BasicInfo memberInfo;
    LocationInfo memberLocation;

    constructor (address creator) public{
        owner = creator;
    }

    function addMemberBasicInformation(bytes32 memberId, string memory name, string memory surname,
                            bytes32 birthdate, bytes32 acceptanceDate) public restricted(msg.sender) {
        BasicInfo memory newMember = BasicInfo({
            memberId: memberId,
            name: name,
            surname: surname,
            birthdate: birthdate,
            acceptanceDate: acceptanceDate,
            totalOccupations: 0
        });

        memberInfo = newMember;
    }

    function addMemberOccupation(string memory occupation) public restricted (msg.sender) {
        uint occupationNumber = memberInfo.totalOccupations;
        memberInfo.occupations[occupationNumber] = occupation;
        memberInfo.totalOccupations = occupationNumber + 1;
    }

    function addMemberLocation(string memory county, string memory office, string memory country) public restricted (msg.sender) {

        LocationInfo memory newMemberLocation = LocationInfo({
            county: county,
            office: office,
            country:country
        });
        memberLocation = newMemberLocation;
    }

    function getMemberSummary() public view returns(bytes32, string memory,
                                                    string memory, bytes32, bytes32, uint)
    {

        return (
            memberInfo.memberId,
            memberInfo.name,
            memberInfo.surname,
            memberInfo.birthdate,
            memberInfo.acceptanceDate,
            memberInfo.totalOccupations
        );
    }

    function getMemberOccupation(uint occupationIndex) public view returns (string memory) {
        return memberInfo.occupations[occupationIndex];
    }

    function getMemberLocation() public view returns (string memory, string memory, string memory ) {
        return (
            memberLocation.office,
            memberLocation.county,
            memberLocation.country
        );
    }

}

