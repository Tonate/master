import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from "ton-core";

export default class Tonate implements Contract {

  static createForDeploy(code: Cell, initData: Cell): Tonate {
    // const data = beginCell()
    //   .storeUint(initialCounterValue, 64)
    //   .endCell();
    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code: code, data: initData });
    return new Tonate(address, { code, data: initData });
  }

  constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {}

  async sendDeploy(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: "0.02", // send 0.01 TON to contract for rent
      bounce: false
    });
  }

  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("balance", []);
    return stack.readBigNumber();
  }

  async getCounter(provider: ContractProvider) {
    const { stack } = await provider.get("counter", []);
    return stack.readBigNumber();
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
      value: "0.005", // send 0.002 TON for gas
      body: messageBody
    });
  }

  async sendWithdrawAll(provider: ContractProvider, via: Sender) {
    const messageBody = beginCell()
      .storeUint(2, 32) // op (op #1 = increment)
      .storeUint(0, 64) // query id
      .endCell();
    await provider.internal(via, {
      value: "0.005", // send 0.002 TON for gas
      body: messageBody
    });
  }

  async sendMoney(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: "0.02"
    });
  }
}