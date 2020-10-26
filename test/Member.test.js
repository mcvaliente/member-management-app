const assert = require("assert");
const { appendFileSync } = require("fs");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider);
//compiled versions of the contracts
const compiledFactory = require("../src/contracts/build/MemberFactory.json");

let accounts; //List of 10 accounts provided by Ganache.
let factory; //Our contract: MemberFactory
let memberAddress;
let member; //our contract: Member
let memberId;
let birthdate;
let acceptanceDate;
let memberDates;
let office;
let county;
let country;
let location;
let occupations;
let occupation1;
let occupation2;
let applicationFileId;
let acceptanceFileId;

beforeEach(async () => {
  //Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  console.log("Available accounts: " + accounts);
  //console.log(JSON.stringify(compiledFactory.abi));
  memberId = await web3.utils.fromAscii("70006672P");
  birthdate = await web3.utils.fromAscii("11/03/1991");
  acceptanceDate = await web3.utils.fromAscii("17/07/2020");
  memberDates = [birthdate, acceptanceDate];
  office = await web3.utils.fromAscii("Barcelona");
  county = await web3.utils.fromAscii("Álava");
  country = await web3.utils.fromAscii("España");
  location = [office, county, country];
  occupation1 = await web3.utils.fromAscii("Actor/Actriz");
  occupation2 = await web3.utils.fromAscii("Bailarín/a");
  occupation3 = await web3.utils.fromAscii("Ilustración científica");
  occupations = [occupation1, occupation2, occupation3];
  applicationFileId = "AnPs55rrWMXcRVuK8HqCcXABCSPn6HDrd9ngjEzMTKdDtD";
  acceptanceFileId = "QmNs55rrWMXcRVuK8HqCcXCHLSPn6HDrd9ngjEzMTKdDtX";

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
        memberDates,
        "Sofía",
        "Fernández Alonso",
        "sofiaf@ccc.es",
        location,
        occupations,
        applicationFileId,
        acceptanceFileId
      )
      .send({
        from: accounts[0],
        gas: "2000000",
      });

    factory.setProvider(provider);
  } catch (err) {
    console.log("Catched exception: ", err);
    assert.ok(err);
  }
});

describe("Members", () => {
  it("deploys a factory and adds a member", async () => {
    const totalMembers = await factory.methods.getMemberCount().call();
    assert.ok(factory.options.address);
    console.log(
      "=================================================================="
    );
    console.log("Factory address: " + factory.options.address);
    console.log("Number of members: ", totalMembers);
    console.log(
      "=================================================================="
    );
  });

  it("gets the basic information of a new member", async () => {
    try {
      const memberInfo = await factory.methods
        .getMemberSummary(memberId)
        .call();
      console.log("Member info: ", memberInfo);
      const output = "[" + JSON.stringify(memberInfo) + "]";
      const jsonOutput = JSON.parse(output);
      console.log("Object Length: ", jsonOutput.length);
      for (var i = 0; i < jsonOutput.length; i++) {
        console.log("Name: ", jsonOutput[i]["2"]);
      }
      assert.strictEqual(jsonOutput[0]["2"], "Sofía");  //Ver url: https://nodejs.org/api/assert.html#assert_assert_equal_actual_expected_message
    } catch (err) {
      console.log("Catched exception: ", err);
      assert.ok(err);
    }
  });

  it("gets the occupations of a new member", async () => {
    try {
      const memberOccupations = await factory.methods
        .getMemberOccupations(memberId)
        .call();
      console.log("Member occupations: ", memberOccupations);
      for (var i = 0; i < memberOccupations.length; i++) {
        console.log("Occupation (", i, "): ", web3.utils.toAscii(memberOccupations[i]).replace(/\u0000/g, ""));
      }
      assert.strictEqual(web3.utils.toAscii(memberOccupations[0]).replace(/\u0000/g, ""), "Actor/Actriz");
    } catch (err) {
      console.log("Catched exception: ", err);
      assert.ok(err);
    }
  });

  it("gets the location of a new member", async () => {
    try {
      const memberLocation = await factory.methods
        .getMemberLocation(memberId)
        .call();
      console.log("Member location: ", memberLocation);
      const output = "[" + JSON.stringify(memberLocation) + "]";
      const jsonOutput = JSON.parse(output);
      for (var i = 0; i < jsonOutput.length; i++) {
        console.log("Office: ", web3.utils.toAscii(jsonOutput[i]["0"]).replace(/\u0000/g, ""));
        console.log("County: ", web3.utils.toAscii(jsonOutput[i]["1"]).replace(/\u0000/g, ""));
        console.log("Country: ", web3.utils.toAscii(jsonOutput[i]["2"]).replace(/\u0000/g, ""));
      }
      assert.strictEqual(web3.utils.toAscii(jsonOutput[0]["0"]).replace(/\u0000/g, ""), "Barcelona");
    } catch (err) {
      console.log("Catched exception: ", err);
      assert.ok(err);
    }
  });

  it("gets the files of a new member", async () => {
    try {
      const memberFiles = await factory.methods
        .getMemberFiles(memberId)
        .call();
      console.log("Member files: ", memberFiles);
      const output = "[" + JSON.stringify(memberFiles) + "]";
      const jsonOutput = JSON.parse(output);
      for (var i = 0; i < jsonOutput.length; i++) {
        console.log("Application file id: ", jsonOutput[i]["0"]);
        console.log("Acceptance file id: ", jsonOutput[i]["1"]);
      }
      assert.strictEqual(jsonOutput[0]["0"], "AnPs55rrWMXcRVuK8HqCcXABCSPn6HDrd9ngjEzMTKdDtD");
    } catch (err) {
      console.log("Catched exception: ", err);
      assert.ok(err);
    }
  });

});
