import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "ton-crypto";
import {
  TonClient,
  Cell,
  WalletContractV4,
  beginCell,
  Address,
  Slice,
  comment,
  Sender,
  OpenedContract,
} from "ton";
import Tonate from "../contracts/tonate"; // this is the interface class from step 7
import { DeployTonateDto } from "./deploy.dto";

const TONATE_TRACKER_WALLET_ADDRESS =
  "EQD95aQy4L1JhesahCd4broGOY4XNoxdkIDp-t12usfcgy1_";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function initDataPublic(
  ownerAddress: Address,
  tonTrackerAddress: Address,
  userNumber: number,
  title: string
): Cell {
  return beginCell()
    .storeAddress(ownerAddress)
    .storeAddress(tonTrackerAddress)
    .storeUint(Date.now(), 64)
    .storeUint(userNumber, 64)
    .storeRef(comment(title))
    .endCell();
}

function initDataPrivate(
  ownerAddress: Address,
  userNumber: number,
  title: string
): Cell {
  return beginCell()
    .storeAddress(ownerAddress)
    .storeUint(Date.now(), 64)
    .storeUint(userNumber, 64)
    .storeRef(comment(title))
    .endCell();
}

// Deploy Tonate
export async function deployTonate(via: Sender, dto: DeployTonateDto) {
  
  // initCode
  const tonateCellName = "tonate_" + dto.visibility + "_" + dto.method + ".cell";
  // // retreive cell data
  const tonateCell = await fetch("https://tonate.xyz/" + tonateCellName)
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => Buffer.from(arrayBuffer));
    
  const tonateCode = Cell.fromBoc(tonateCell)[0];

  // initCell
  let tonate;
  if (dto.visibility == "public"){
    tonate = Tonate.createForDeploy(
      tonateCode,
      initDataPublic(
        Address.parse(dto.userAddress!),
        Address.parse(TONATE_TRACKER_WALLET_ADDRESS),
        dto.userNumber!,
        dto.title!
      )
    );
  }
  else{ // dto.visibility == "private"
    tonate = Tonate.createForDeploy(
      tonateCode,
      initDataPrivate(
        via.address!,
        dto.userNumber!,
        dto.title!
      )
    );
  }

  // // init client to make Open Contract
  const client = new TonClient({
    endpoint: await getHttpEndpoint({ network: "testnet" }),
  });

  const tonateContract = client.open(tonate) as OpenedContract<Tonate>;

  tonateContract.sendDeploy(via, dto.balance!.toString());
  

  return tonateContract.address;
}

export async function deploy(via: Sender, dto: DeployTonateDto) {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "venture blame drastic consider flame argue will harvest choose shift near hollow corn venue want leg shrimp travel urban honey saddle say elephant heart";
  const key = await mnemonicToWalletKey(mnemonic!.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // initCode
  const tonateCellName = "tonate_" + dto.visibility + "_" + dto.method + ".cell";
  // // retreive cell data
  const tonateCell = await fetch("https://tonate.xyz/" + tonateCellName)
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => Buffer.from(arrayBuffer));
  
  // prepare Counter's initial code and data cells for deployment
  const tonateCode = Cell.fromBoc(tonateCell)[0];

  // initCell
  let tonate;
  if (dto.visibility == "public"){
    tonate = Tonate.createForDeploy(
      tonateCode,
      initDataPublic(
        Address.parse(dto.userAddress!),
        Address.parse(TONATE_TRACKER_WALLET_ADDRESS),
        dto.userNumber!,
        dto.title!
      )
    );
  }
  else{ // dto.visibility == "private"
    tonate = Tonate.createForDeploy(
      tonateCode,
      initDataPrivate(
        via.address!,
        dto.userNumber!,
        dto.title!
      )
    );
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  const tonateContract = client.open(tonate);
  
  // send the deploy transaction
  await tonateContract.sendDeploy(walletSender, dto.balance!.toString());

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for deploy transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("deploy transaction confirmed!");

  return tonate.address;
}

// deploy();

// deploy();

