// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.7.0;

contract MemberFactory {
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
    bytes16[] deployedMembers;
    mapping(bytes16 => bool) activeMembers;

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
        deployedMembers.push(memberId);
    }

    function getMemberCount() public view returns (uint256) {
        return deployedMembers.length;
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
}
