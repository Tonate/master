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
  // return contract address

  // initCode
  let tonateCellName;
  if (dto.visibility == "private" && dto.method == "random") {
    tonateCellName = "tonate_private_random.cell";
  } else if (dto.visibility == "private" && dto.method == "split") {
    tonateCellName = "tonate_private_split.cell";
  } else if (dto.visibility == "public" && dto.method == "random") {
    tonateCellName = "tonate_public_random.cell";
  } else if (dto.visibility == "public" && dto.method == "split") {
    tonateCellName = "tonate_public_split.cell";
  }

  // retreive cell data
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
        via.address!,
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

  // init client to make Open Contract
  const client = new TonClient({
    endpoint: await getHttpEndpoint({ network: "testnet" }),
  });

  const tonateContract = client.open(tonate) as OpenedContract<Tonate>;

  tonateContract.sendDeploy(via, dto.balance!.toString());

  return tonate.address;
}

export async function deploy() {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic =
    "venture blame drastic consider flame argue will harvest choose shift near hollow corn venue want leg shrimp travel urban honey saddle say elephant heart";
  const key = await mnemonicToWalletKey(mnemonic!.split(" "));

  console.log(key);

  const wallet = WalletContractV4.create({
    publicKey: key.publicKey,
    workchain: 0,
  });

  console.log(wallet);

  if (!(await client.isContractDeployed(wallet.address))) {
    return console.log("wallet is not deployed");
  }

  const tonateCell = await fetch("https://tonate.xyz/tonate.cell")
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => {
      console.log(arrayBuffer);

      return new Buffer(arrayBuffer);
    });

  console.log(tonateCell);

  // prepare Counter's initial code and data cells for deployment
  const tonateCode = Cell.fromBoc(tonateCell)[0]; // compilation output from step 6

  console.log(tonateCode);

  const tonateTitle = "Tonate Team Fund";
  
  const tonate = Tonate.createForDeploy(
    tonateCode,
    initDataPrivate(
      wallet.address,
      1,
      tonateTitle
    )
  );

  console.log(tonate);

  // exit if contract is already deployed
  console.log("contract address:", tonate.address.toString());
  if (await client.isContractDeployed(tonate.address)) {
    return console.log("Counter already deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  const tonateContract = client.open(tonate);

  // send the deploy transaction
  await tonateContract.sendDeploy(walletSender, 1);

  // send Ton Eat transaction
  // const tonateAddress = Address.parse("EQAtii2cWTG_9k9wIfFSF-Tg1ZSl3jTa8SWyUuJ7VY76iLNj");
  //   const tonateAddress = Address.parse("EQCUdyHoh6WSHcd02oICpbz5SZxZv_Ig_nBpQcebk-Omf2BT");
  //   const tonate = new Tonate(tonateAddress);
  //   const tonateContract = client.open(tonate);
  //   await tonateContract.sendReceiveTon(walletSender);

  // send Send Money transaction
  //   const tonateAddress = Address.parse("EQAtii2cWTG_9k9wIfFSF-Tg1ZSl3jTa8SWyUuJ7VY76iLNj");
  //   const tonate = new Tonate(tonateAddress);
  //   const tonateContract = client.open(tonate);
  //   await tonateContract.sendMoney(walletSender);

  // send Withdraw All transaction
  //   const tonateAddress = Address.parse("EQAtii2cWTG_9k9wIfFSF-Tg1ZSl3jTa8SWyUuJ7VY76iLNj");
  //   const tonate = new Tonate(tonateAddress);
  //   const tonateContract = client.open(tonate);
  //   await tonateContract.sendWithdrawAll(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for deploy transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("deploy transaction confirmed!");

  return walletContract;
}

// deploy();

