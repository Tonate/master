import { getHttpEndpoint } from "@orbs-network/ton-access";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { TonClient } from "ton";
import { Address } from "ton-core";
import Tonate from "../contracts/tonate";

const TONSCAN_API_URL = "https://testnet.tonapi.io/v1/blockchain";
const TONATE_TRACKER_WALLET_ADDRESS =
  "EQCNu093HYrzqh_OUpv-ouZY3SaIKlwotrjl7DNyvgVNHclP";
const TONATE_MIN_AMOUNT = 10000000;

interface msg_ton {
  destination: addressTon;
  source: addressTon;
  value: number;
}

interface addressTon {
  address: string;
  isScam: boolean;
}

interface trasactionDto {
  account: addressTon;
  in_msg: msg_ton;
  out_msgs: Array<msg_ton>;
}

// axios http client
async function getData(url: string): Promise<any> {
  try {
    const config: AxiosRequestConfig = {
      url: url,
      method: "get",
    };
    const response: AxiosResponse = await axios(config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Get all trasactions of TonateTrackerWallet
async function getTransactions(address: String) {
  var transactions;
  try {
    transactions = await getData(
      `${TONSCAN_API_URL}/getTransactions?account=${address}`
    );
  } catch (e) {
    console.error(e);
  }
  return transactions["transactions"];
}

// Get all smartcontract address of transactions towared TonateTrackerWallet
async function parseIncommingTransactions(transactions: Array<trasactionDto>) {
  let incommingAddressList: Array<string> = [];

  transactions.forEach((trx) => {
    const address = trx?.in_msg?.source?.address;
    if (address) {
      incommingAddressList.push(address);
    }
  });
  return incommingAddressList;
}

async function parseOutgoingTransactions(transactions: Array<trasactionDto>) {
  let outgoingAddressList: Array<string> = [];

  transactions.forEach((trx) => {
    const outMsg = trx.out_msgs;
    if (
      outMsg.length == 1 &&
      outMsg[0]?.value >= TONATE_MIN_AMOUNT &&
      outMsg[0]?.destination?.address
    ) {
      outgoingAddressList.push(outMsg[0]?.destination?.address);
    }
  });
  return outgoingAddressList;
}

// Filter only Tonate smartcontract from all incoming address by calling tonate specific caller
// if the smartconract doesn't provide that caller, then it is not a tonate smartcontract
async function filterTonateAddress(incomingAddressList: Array<string>) {
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  const tonateAddressList = await Promise.allSettled(
    incomingAddressList.map((address) => checkIsTonate(address, client))
  );

  return tonateAddressList
    .filter((result) => result.status === "fulfilled")
  //@ts-ignore
    .map((promise) => promise.value);
}

// if counter is 0, then it is Tonate smartcontract (can be updated)
async function checkIsTonate(address: string, client: TonClient) {
  const contractAddress = Address.parse(address);
  const tonate = new Tonate(contractAddress);
  const tonateContract = client.open(tonate);
  let counter;

  try {
    counter = await tonateContract.getCounter();
  } catch (e) {
    throw e;
  }

  return counter === BigInt(0) ? address : null;
}

export async function scanTonateContractAddressAll() {
  // Get all trasactions of TonateTrackerWallet
  const transactions = await getTransactions(TONATE_TRACKER_WALLET_ADDRESS);
  // Parse all smartcontract address of transactions towared TonateTrackerWallet
  const tonateIncommingAddress = await parseIncommingTransactions(transactions);
  // Filter only Tonate smartcontract from all incoming address by calling tonate specific caller
  const tonateIncomingSmartcontractAddress = await filterTonateAddress(
    tonateIncommingAddress
  );

  return tonateIncomingSmartcontractAddress;
}

export async function scanContractAddressMypageRecieved(userAddress: string) {
  const transactions = await getTransactions(userAddress);
  const IncommingAddress = await parseIncommingTransactions(transactions);
  const tonateIncomingSmartcontractAddress = await filterTonateAddress(
    IncommingAddress
  );
  return tonateIncomingSmartcontractAddress;
}

export async function scanContractAddressMypageTonated(userAddress: string) {
  // Get all trasactions of TonateTrackerWallet
  const transactions = await getTransactions(userAddress);
  const tonateOutgoingAddress = await parseOutgoingTransactions(transactions);
  const tonateOutgoingSmartcontractAddress = await filterTonateAddress(
    tonateOutgoingAddress
  );
  return tonateOutgoingSmartcontractAddress;
}

async function main() {
  const tonateContractAddressAll = await scanTonateContractAddressAll();
  console.log("[All Public Tonate Contract Address]");
  console.log(tonateContractAddressAll);

  const myTonateRecievedAddressList = await scanContractAddressMypageRecieved(
    "EQCsq-ATp2uOJtAla-wO4fIs1zx52pqYWava9RDgD7wlLPW6"
  );
  console.log("[My Recieved Tonate Contract Address]");
  console.log(myTonateRecievedAddressList);

  const myTonateAddressList = await scanContractAddressMypageTonated(
    "EQCsq-ATp2uOJtAla-wO4fIs1zx52pqYWava9RDgD7wlLPW6"
  );
  console.log("[My Tonate Contract Address]");
  console.log(myTonateAddressList);
}

// main();
