// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.7.0;

contract MemberFactory {

    Member[] private deployedMembers;
    mapping(bytes32 => Member) memberAddresses;

    function createMember(bytes32 memberId) public {
        Member newMember = new Member(msg.sender);
        memberAddresses[memberId] = newMember;
        deployedMembers.push(newMember);
     }

    function getDeployedMembers() public view returns (Member[] memory) {
        return deployedMembers;
    }

    function getMemberCount() public view returns (uint){
        return deployedMembers.length;
    }

    function getMemberAddress(bytes32 memberId) public view returns (Member){
        return memberAddresses[memberId];
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
        bool isActive;
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
                            bytes32 birthdate, bytes32 acceptanceDate) public onlyOwner (msg.sender) {
        BasicInfo memory newMember = BasicInfo({
            memberId: memberId,
            name: name,
            surname: surname,
            birthdate: birthdate,
            acceptanceDate: acceptanceDate,
            totalOccupations: 0,
            isActive: true
        });

        memberInfo = newMember;
    }

    function addMemberOccupation(string memory occupation) public onlyOwner (msg.sender) {
        uint occupationNumber = memberInfo.totalOccupations;
        memberInfo.occupations[occupationNumber] = occupation;
        memberInfo.totalOccupations = occupationNumber + 1;
    }

    function addMemberLocation(string memory county, string memory office, string memory country) public onlyOwner (msg.sender) {

        LocationInfo memory newMemberLocation = LocationInfo({
            county: county,
            office: office,
            country:country
        });
        memberLocation = newMemberLocation;
    }

    function getMemberSummary() public view returns(bytes32, string memory,
                                                    string memory, bytes32, bytes32, uint, bool)
    {

        return (
            memberInfo.memberId,
            memberInfo.name,
            memberInfo.surname,
            memberInfo.birthdate,
            memberInfo.acceptanceDate,
            memberInfo.totalOccupations,
            memberInfo.isActive
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

