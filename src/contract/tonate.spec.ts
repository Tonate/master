import * as fs from "fs";
import { Address, beginCell, Cell } from "ton-core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton-community/sandbox";
import Tonate from "./tonate"; // this is the interface class from tutorial 2
import "@ton-community/test-utils"; // register matchers

function data(ownerAddress: Address): Cell {
  return beginCell().storeAddress(ownerAddress).endCell();
}

describe("Counter tests", () => {
  let blockchain: Blockchain;
  let wallet1: SandboxContract<TreasuryContract>;
  let tonateContract: SandboxContract<Tonate>;
  
  beforeEach(async () =>  {
    // initialize the blockchain sandbox
    blockchain = await Blockchain.create();
    wallet1 = await blockchain.treasury("user1");

    const tonate_pub_random = "../contract_Func/tonate_public_random.cell"
    const tonateCode = Cell.fromBoc(fs.readFileSync(tonate_pub_random))[0]; // compilation output from tutorial 2
    // const tonate_pub_split = "../contract_Func/tonate_public_split.cell"
    // const tonateCode = Cell.fromBoc(fs.readFileSync(tonate_pub_split))[0]; // compilation output from tutorial 2
    // const tonate_priv_random = "../contract_Func/tonate_private_random.cell"
    // const tonateCode = Cell.fromBoc(fs.readFileSync(tonate_priv_random))[0]; // compilation output from tutorial 2
    // const tonate_priv_split = "../contract_Func/tonate_private_split.cell"
    // const tonateCode = Cell.fromBoc(fs.readFileSync(tonate_priv_split))[0]; // compilation output from tutorial 2

    // prepare Counter's initial code and data cells for deployment
    // const tonateCode = Cell.fromBoc(fs.readFileSync(tonate_pub_random))[0]; // compilation output from tutorial 2
    const initialDepositValue = 30; // no collisions possible since sandbox is a private local instance
    const tonate = Tonate.createForDeploy(tonateCode, data(wallet1.address));

    // deploy counter
    tonateContract = blockchain.openContract(tonate);
    await tonateContract.sendDeploy(wallet1.getSender());
  }),

  it("should get balance value", async () => {
    const value = await tonateContract.getBalance();
    console.log(value);
    expect(value).toEqual(30n);
  });

  it("should get counter value", async () => {
    const value = await tonateContract.getCounter();
    console.log(value);
    expect(value).toEqual(30n);
  });

  it("should get address value", async () => {
    const value = await tonateContract.getAddress();
    console.log(value);
    expect(value).toEqual(30n);
  });

  it("should tonEat decreate the balance", async () =>  {
    await tonateContract.sendEat(wallet1.getSender());
    const depositValue = await tonateContract.getBalance();
    console.log(depositValue);
    expect(depositValue).toEqual(18n);
  })

  it("should tonEat decreate the balance2", async () =>  {
    await tonateContract.sendEat(wallet1.getSender());
    const depositValue = await tonateContract.getBalance();
    console.log(depositValue);
    expect(depositValue).toEqual(18n);
  })
});
