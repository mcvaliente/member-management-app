// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

/**
 * A base contract to be inherited by any contract that want to receive relayed transactions
 * A subclass must use "_msgSender()" instead of "msg.sender"
 */
contract BaseRelayRecipient {

    /*
     * Forwarder singleton we accept calls from
     */
    address public trustedForwarder;

    modifier trustedForwarderOnly() {
        require(msg.sender == address(trustedForwarder), "Function can only be called through the trusted Forwarder.");
        _;
    }

    function isTrustedForwarder(address forwarder) public view returns(bool) {
        return forwarder == trustedForwarder;
    }

    /**
     * return the sender of this call.
     * if the call came through our trusted forwarder, return the original sender.
     * otherwise, return `msg.sender`.
     * should be used in the contract anywhere instead of msg.sender
     */
    function _msgSender() internal virtual view returns (address ret) {
        if (msg.data.length >= 24 && isTrustedForwarder(msg.sender)) {
            // At this point we know that the sender is a trusted forwarder,
            // so we trust that the last bytes of msg.data are the verified sender address.
            // Extract sender address from the end of msg.data.
            assembly {
                ret := shr(96,calldataload(sub(calldatasize(),20)))
            }
        } else {
            return msg.sender;
        }
    }
}

contract MemberFactory is BaseRelayRecipient {
    struct MemberInfo {
        PersonalInfo personalData; //name, surname, birthdate, email
        LocationInfo memberLocation; //office, county, country
        bytes32[] occupations;
        bytes16 acceptanceDate; //dd/mm/aaaa
        FileInfo memberFiles;
        bool isActive;
    }

    struct PersonalInfo {
        bytes16 birthdate; //dd/mm/aaaa
        string name;
        string surname;
        string email;
    }

    struct LocationInfo {
        bytes32 office;
        bytes32 county;
        bytes32 country;
    }

    struct FileInfo {
        string applicationFileId;
        string acceptanceFileId;
    }

    mapping(bytes16 => MemberInfo) members; //NIF/NIE for the identification of a member (bytes16).
    uint32 deployedMembers;
    mapping(bytes16 => bool) activeMembers;

    constructor (address _trustedForwarder) {
        trustedForwarder = _trustedForwarder;
    }

    function createMember(
        bytes16 memberId,
        bytes16[] memory memberDates,
        string memory name,
        string memory surname,
        string memory email,
        bytes32[] memory location,
        bytes32[] memory occupations,
        string memory applicationFileId,
        string memory acceptanceFileId
    ) public {
        PersonalInfo memory personalData = PersonalInfo({
            birthdate: memberDates[0],
            name: name,
            surname: surname,
            email: email
        });

        LocationInfo memory locationData = LocationInfo({
            office: location[0],
            county: location[1],
            country: location[2]
        });

        FileInfo memory fileData = FileInfo({
            applicationFileId: applicationFileId,
            acceptanceFileId: acceptanceFileId
        });

        MemberInfo memory newMember = MemberInfo({
            personalData: personalData,
            memberLocation: locationData,
            occupations: occupations,
            acceptanceDate: memberDates[1],
            memberFiles: fileData,
            isActive: true
        });

        members[memberId] = newMember;
        activeMembers[memberId] = true;
        deployedMembers++;
    }

    function getMemberCount() public view returns (uint32) {
        return deployedMembers;
    }

    function memberExists(bytes16 memberId) public view returns (bool) {
        if (activeMembers[memberId]) {
            return true;
        } else {
            return false;
        }
    }

    function getMemberSummary(bytes16 memberId)
        public
        view
        returns (
            bytes32,
            bytes32,
            string memory,
            string memory,
            string memory,
            bool
        )
    {
        return (
            members[memberId].personalData.birthdate,
            members[memberId].acceptanceDate,
            members[memberId].personalData.name,
            members[memberId].personalData.surname,
            members[memberId].personalData.email,
            members[memberId].isActive
        );
    }

    function getMemberLocation(bytes16 memberId)
        public
        view
        returns (
            bytes32,
            bytes32,
            bytes32
        )
    {
        return (
            members[memberId].memberLocation.office,
            members[memberId].memberLocation.county,
            members[memberId].memberLocation.country
        );
    }

    function getMemberOccupations(bytes16 memberId)
        public
        view
        returns (bytes32[] memory)
    {
        return members[memberId].occupations;
    }

    function getMemberFiles(bytes16 memberId)
        public
        view
        returns (string memory, string memory)
    {
        return (
            members[memberId].memberFiles.applicationFileId,
            members[memberId].memberFiles.acceptanceFileId
        );
    }

    function updateMember(
        bool activeMember,
        bytes16 memberId,
        bytes16[] memory memberDates,
        string memory name,
        string memory surname,
        string memory email,
        bytes32[] memory location,
        bytes32[] memory occupations
    ) public {
        PersonalInfo memory personalData = PersonalInfo({
            birthdate: memberDates[0],
            name: name,
            surname: surname,
            email: email
        });

        LocationInfo memory locationData = LocationInfo({
            office: location[0],
            county: location[1],
            country: location[2]
        });
    
        MemberInfo memory updatedMember = MemberInfo({
            personalData: personalData,
            memberLocation: locationData,
            occupations: occupations,
            acceptanceDate: memberDates[1],
            memberFiles: members[memberId].memberFiles,
            isActive: activeMember
        });

        members[memberId] = updatedMember;
        activeMembers[memberId] = activeMember;
        if (!activeMember){
            deployedMembers--;
        }
    }
}
