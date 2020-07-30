// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.7.0;

contract MemberFactory {
    Member[] private deployedMembers;
    mapping(bytes32 => Member) memberAddresses;

    function createMember(
        bytes32 memberId,
        string memory name,
        string memory surname,
        bytes32 birthdate,
        string memory office,
        string memory county,
        string memory country,
        bytes32[] memory occupations,
        bytes32 acceptanceDate
    ) public {
        //Create the contract instance.
        Member newMember = new Member();
        memberAddresses[memberId] = newMember;
        deployedMembers.push(newMember);
        //Add the member information.
        newMember.addMemberInformation(
            memberId,
            name,
            surname,
            birthdate,
            office,
            county,
            country,
            occupations,
            acceptanceDate
        );
    }

    function getDeployedMembers() public view returns (Member[] memory) {
        return deployedMembers;
    }

    function getMemberCount() public view returns (uint256) {
        return deployedMembers.length;
    }

    function getMemberAddress(bytes32 memberId) public view returns (Member) {
        return memberAddresses[memberId];
    }
}

contract Member {
    struct MemberInfo {
        PersonalInfo personalData; //NIF/NIE, name, surname, birthdate
        LocationInfo memberLocation; //office, county, country
        mapping(uint256 => bytes32) occupations;
        uint256 totalOccupations;
        bytes32 acceptanceDate; //dd/mm/aaaa
        bool isActive;
    }

    struct PersonalInfo {
        bytes32 memberId; //NIF/NIE
        bytes32 birthdate; //dd/mm/aaaa
        string name;
        string surname;
    }

    struct LocationInfo {
        string office;
        string county;
        string country;
    }

    MemberInfo memberInfo;

    function addMemberInformation(
        bytes32 memberId,
        string memory name,
        string memory surname,
        bytes32 birthdate,
        string memory office,
        string memory county,
        string memory country,
        bytes32[] memory occupations,
        bytes32 acceptanceDate
    ) public {
        PersonalInfo memory personalData = PersonalInfo({
            memberId: memberId, birthdate: birthdate, name: name, surname: surname
        });

        LocationInfo memory locationData = LocationInfo({
            office: office, county: county, country: country
        });

        MemberInfo memory newMember = MemberInfo({
            personalData: personalData, memberLocation: locationData, totalOccupations: occupations.length, acceptanceDate: acceptanceDate, isActive: true
        });

        memberInfo = newMember;

        for (uint256 i = 0; i < occupations.length; i++) {
            memberInfo.occupations[i] = occupations[i];
        }
    }

    function getMemberSummary()
        public
        view
        returns (
            bytes32,
            bytes32,
            bytes32,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            uint256,
            bool
        )
    {
        return (
            memberInfo.personalData.memberId,
            memberInfo.personalData.birthdate,
            memberInfo.acceptanceDate,
            memberInfo.personalData.name,
            memberInfo.personalData.surname,
            memberInfo.memberLocation.office,
            memberInfo.memberLocation.county,
            memberInfo.memberLocation.country,
            memberInfo.totalOccupations,
            memberInfo.isActive
        );
    }

    function getMemberOccupation(uint256 occupationIndex) public view returns (bytes32)
    {
        return memberInfo.occupations[occupationIndex];
    }
}
