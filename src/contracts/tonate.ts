import {
  Contract,
  ContractProvider,
  Sender,
  Address,
  Cell,
  contractAddress,
  beginCell,
} from "ton-core";
import { DeployTonateDto } from "../helpers/deploy.dto";

export default class Tonate implements Contract {
  
  static createForDeploy(code: Cell, initData: Cell): Tonate {
    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code: code, data: initData });
    return new Tonate(address, { code, data: initData });
  }

  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  async sendDeploy(provider: ContractProvider, via: Sender, balance : string) {
    await provider.internal(via, {
      value: "0.017",
      bounce: false,
    });
  }

  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("balance", []);
    return (
      Number.parseFloat(stack.readBigNumber().toString()) / 1000000000
    ).toFixed(3);
  }

  async getCounter(provider: ContractProvider) {
    const { stack } = await provider.get("counter", []);
    return stack.readBigNumber();
  }

  async getUserNumber(provider: ContractProvider) {
    const { stack } = await provider.get("user_number", []);
    return stack.readBigNumber();
  }

  async getTitle(provider: ContractProvider) {
    const { stack } = await provider.get("title", []);
    return stack.readString();
  }

  async getOwnerAddress(provider: ContractProvider) {
    const { stack } = await provider.get("address", []);
    return stack.readAddress();
  }

  async sendReceiveTon(provider: ContractProvider, via: Sender) {
    const messageBody = beginCell()
      .storeUint(1, 32) // op (op #1 = increment)
      .storeUint(0, 64) // query id
      .endCell();
    await provider.internal(via, {
      value: "0.005", // send 0.005 TON for gas
      body: messageBody,
    });
  }

  async sendWithdrawAll(provider: ContractProvider, via: Sender) {
    const messageBody = beginCell()
      .storeUint(2, 32) // op (op #2 = recieve TON)
      .storeUint(0, 64) // query id
      .endCell();
    await provider.internal(via, {
      value: "0.005", // send 0.005 TON for gas
      body: messageBody,
    });
  }

  async sendMoney(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: "0.02",
    });
  }
}
