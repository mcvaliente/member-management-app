// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.7.0;

contract MemberFactory {
    Member[] private deployedMembers;
    mapping(bytes32 => Member) memberAddresses;

    function createMember(
        bytes32 memberId,
        bytes32[] memory memberDates,
        string memory name,
        string memory surname,
        string memory email,
        bytes32[] memory location,
        bytes32[] memory occupations
    ) public {
        //Create the contract instance.
        Member newMember = new Member();
        memberAddresses[memberId] = newMember;
        deployedMembers.push(newMember);
        //Add the member information.
        newMember.addMemberInformation(
            memberId,
            memberDates,
            name,
            surname,
            email,
            location,
            occupations
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
        bytes32[] occupations;
        bytes32 acceptanceDate; //dd/mm/aaaa
        bool isActive;
    }

    struct PersonalInfo {
        bytes32 memberId; //NIF/NIE
        bytes32 birthdate; //dd/mm/aaaa
        string name;
        string surname;
        string email;
    }

    struct LocationInfo {
        bytes32 office;
        bytes32 county;
        bytes32 country;
    }

    MemberInfo memberInfo;

    function addMemberInformation(
        bytes32 memberId,
        bytes32[] memory memberDates,
        string memory name,
        string memory surname,
        string memory email,
        bytes32[] memory location,
        bytes32[] memory occupations
    ) public {
        PersonalInfo memory personalData = PersonalInfo({
            memberId: memberId, birthdate: memberDates[0], name: name, surname: surname, email: email
        });

        LocationInfo memory locationData = LocationInfo({
            office: location[0], county: location[1], country: location[2]
        });

        MemberInfo memory newMember = MemberInfo({
            personalData: personalData, memberLocation: locationData, occupations : occupations, acceptanceDate: memberDates[1], isActive: true
        });

        memberInfo = newMember;

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
            bytes32,
            bytes32,
            bytes32,
            bool
        )
    {
        return (
            memberInfo.personalData.memberId,
            memberInfo.personalData.birthdate,
            memberInfo.acceptanceDate,
            memberInfo.personalData.name,
            memberInfo.personalData.surname,
            memberInfo.personalData.email,
            memberInfo.memberLocation.office,
            memberInfo.memberLocation.county,
            memberInfo.memberLocation.country,
            memberInfo.isActive
        );
    }

    function getMemberOccupations() public view returns (bytes32[] memory)
    {
        return memberInfo.occupations;
    }

}
