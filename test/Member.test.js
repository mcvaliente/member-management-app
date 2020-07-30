const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider);
//compiled versions of the contracts
const compiledFactory = require("../src/contracts/build/MemberFactory.json");
const compiledMember = require("../src/contracts/build/Member.json");

let accounts; //List of 10 accounts provided by Ganache.
let factory; //Our contract: MemberFactory
let memberAddress;
let member; //our contract: Member
let memberId;
let birthdate;
let acceptanceDate;
let occupations;

beforeEach(async () => {
  //Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  console.log("Available accounts: " + accounts);
  //console.log(JSON.stringify(compiledFactory.abi));
  memberId = await web3.utils.fromAscii("70006672P");
  birthdate = await web3.utils.fromAscii("11/03/1991");
  acceptanceDate = await web3.utils.fromAscii("17/07/2020");
  occupation1 = await web3.utils.fromAscii("Actor/Actriz");
  occupation2 = await web3.utils.fromAscii("Bailarín/a");
  occupations = [occupation1, occupation2];

  //MEMBER FACTORY
  //Use one of those accounts to deploy the MemberFactory contract and get the instance.
  //In order to deploy we must take into account the gas that we are using.
  //In this case we need 200000 instead of 1000000 as in the CampaignFactory example.
  try {
    factory = await new web3.eth.Contract(compiledFactory.abi)
      .deploy({ data: "0x" + compiledFactory.evm.bytecode.object })
      .send({ from: accounts[0], gas: "2000000" });

    await factory.methods
      .createMember(
        memberId,
        "Sofía",
        "Fernández Alonso",
        birthdate,
        "Barcelona",
        "Álava",
        "España",
        occupations,
        acceptanceDate
      )
      .send({
        from: accounts[0],
        gas: "2000000",
      });

    //MEMBER
    const addresses = await factory.methods.getDeployedMembers().call();
    memberAddress = addresses[0];
    console.log("Member address from deployed members: ", memberAddress);
    //Javascript representation of the Member instance that we have created through the member contract address.
    member = await new web3.eth.Contract(compiledMember.abi, memberAddress);

    //Member from the mapping id => address
    const mappingMemberAddress = await factory.methods
      .getMemberAddress(memberId)
      .call();
    console.log("Member address from mapping: ", mappingMemberAddress);
    factory.setProvider(provider);
    member.setProvider(provider);
  } catch (err) {
    console.log("Catched exception: ", err);
    assert.ok(err);
  }
});

describe("Members", () => {
  it("deploys a factory and a member", () => {
    assert.ok(factory.options.address);
    console.log(
      "=================================================================="
    );
    console.log("Member address: " + member.options.address);
    console.log(
      "=================================================================="
    );
    assert.ok(member.options.address);
  });

  it("gets the basic information of a new member", async () => {
    try {
      const memberInfo = await member.methods.getMemberSummary().call();
      console.log("Member info", memberInfo);
      const output = "[" + JSON.stringify(memberInfo) + "]";
      const jsonOutput = JSON.parse(output);
      for (var i = 0; i < jsonOutput.length; i++) {
        console.log("NIF/NIE: ", web3.utils.toAscii(jsonOutput[i]["0"]));
      }
      assert(web3.utils.fromAscii("70006672P"), memberInfo.memberId);
    } catch (err) {
      console.log("Catched exception: ", err);
      assert.ok(err);
    }
  });

  it("gets the occupations of a new member", async () => {
    try {
      const memberOccupations = await member.methods
        .getMemberOccupations()
        .call();
      console.log("Member occupations: ", memberOccupations);
      for (var i = 0; i < memberOccupations.length; i++) {
        console.log("Occupation (", i, "): ", web3.utils.toAscii(memberOccupations[i]));
      }
      assert(web3.utils.fromAscii("Actor/Actriz"), web3.utils.toAscii(memberOccupations[0]));
    } catch (err) {
      console.log("Catched exception: ", err);
      assert.ok(err);
    }
  });

});
