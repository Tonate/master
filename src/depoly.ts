import * as fs from "fs";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "ton-crypto";
import { TonClient, Cell, WalletContractV4, beginCell, Address } from "ton";
import Tonate from "./contract/tonate"; // this is the interface class from step 7
import dotenv from "dotenv"
dotenv.config({path:__dirname+'/../.env'})

function initData(ownerAddress: Address, tonTrackerAddress: Address): Cell {
  return beginCell().storeAddress(ownerAddress).storeAddress(tonTrackerAddress).storeUint(Date.now(), 64).endCell();
}

async function deploy() {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = process.env.MNEMONIC; // MNEMONIC = "asdaasd asdasd asdasda sdasd ~ ~ ~"
  const key = await mnemonicToWalletKey(mnemonic!.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // prepare Counter's initial code and data cells for deployment
  const tonateCode = Cell.fromBoc(fs.readFileSync("./contract_Func/tonate.cell"))[0]; // compilation output from step 6
  // const tonate = Tonate.createForDeploy(tonateCode, initData(wallet.address, Address.parse("EQCUdyHoh6WSHcd02oICpbz5SZxZv_Ig_nBpQcebk-Omf2BT")));

  // exit if contract is already deployed
  // console.log("contract address:", tonate.address.toString());
  // if (await client.isContractDeployed(tonate.address)) {
  //   return console.log("Counter already deployed");
  // }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // const tonateContract = client.open(tonate);
  
  // send the deploy transaction
  // await tonateContract.sendDeploy(walletSender);

  // send Ton Eat transaction
  // const tonateAddress = Address.parse("EQAtii2cWTG_9k9wIfFSF-Tg1ZSl3jTa8SWyUuJ7VY76iLNj");
  const tonateAddress = Address.parse("EQCUdyHoh6WSHcd02oICpbz5SZxZv_Ig_nBpQcebk-Omf2BT");
  const tonate = new Tonate(tonateAddress);
  const tonateContract = client.open(tonate);
  await tonateContract.sendEat(walletSender);

  // send Send Money transaction
  // const tonateAddress = Address.parse("EQAtii2cWTG_9k9wIfFSF-Tg1ZSl3jTa8SWyUuJ7VY76iLNj");
  // const tonate = new Tonate(tonateAddress);
  // const tonateContract = client.open(tonate);
  // await tonateContract.sendMoney(walletSender);

  // send Withdraw All transaction
  // const tonateAddress = Address.parse("EQAtii2cWTG_9k9wIfFSF-Tg1ZSl3jTa8SWyUuJ7VY76iLNj");
  // const tonate = new Tonate(tonateAddress);
  // const tonateContract = client.open(tonate);
  // await tonateContract.sendWithdrawAll(walletSender);


  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for deploy transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("deploy transaction confirmed!");
}

deploy();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
