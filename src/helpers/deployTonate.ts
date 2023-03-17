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
  console.log(dto);
  console.log(tonateCellName);
  // retreive cell data
  const tonateCell = await fetch("https://tonate.xyz/" + tonateCellName)
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => Buffer.from(arrayBuffer));

  const tonateCode = Cell.fromBoc(tonateCell)[0];
  console.log(tonateCode.toString());

  console.log(dto.userAddress);
  console.log(dto.userNumber);
  console.log(dto.title);
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

  // init client to make Open Contract
  const client = new TonClient({
    endpoint: await getHttpEndpoint({ network: "testnet" }),
  });

  const tonateContract = client.open(tonate) as OpenedContract<Tonate>;
  console.log(tonateContract);
  console.log("via and balance");
  console.log(via);
  console.log(dto.balance!.toString());
  tonateContract.sendDeploy(via, dto.balance!.toString());
  

  return tonateContract.address;
}

// deploy();

