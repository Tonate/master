import { getHttpEndpoint } from "@orbs-network/ton-access";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { TonClient } from "ton";
import { Address } from "ton-core";
import Tonate from "../contracts/tonate";

const TONSCAN_API_URL = "https://testnet.tonapi.io/v1/blockchain";
const TONATE_TRACKER_WALLET_ADDRESS =
  "EQD95aQy4L1JhesahCd4broGOY4XNoxdkIDp-t12usfcgy1_";

interface in_msg_ton {
  destination: addressTon;
  source: addressTon;
}

interface addressTon {
  address: string;
  isScam: boolean;
}

interface trasactionDto {
  account: addressTon;
  in_msg: in_msg_ton;
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
async function parseTonateTransactions(transactions: Array<trasactionDto>) {
  let incomingAddressList: Array<string> = [];

  transactions.forEach((trx) => {
    const address = trx?.in_msg?.source?.address;
    if (address) {
      incomingAddressList.push(address);
    }
  });
  console.log("[Incoming Address List]");
  console.log(incomingAddressList);
  return incomingAddressList;
}

// Filter only Tonate smartcontract from all incoming address by calling tonate specific caller
// if the smartconract doesn't provide that caller, then it is not a tonate smartcontract
async function filterTonateAddress(incomingAddressList: Array<string>) {
  let tonateAddressList: Array<string> = [];
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  for (const address of incomingAddressList) {
    if (address) {
      const contractAddress = Address.parse(address);
      const tonate = new Tonate(contractAddress);
      const tonateContract = client.open(tonate);
      let counter;
      try {
        counter = await tonateContract.getCounter();
      } catch (e) {
        // console.log(e);
      }
      if (counter == BigInt(0)) {
        tonateAddressList.push(address);
      }
    }
  }
  console.log("[Tonate SmartContract Address List]");
  console.log(tonateAddressList);
  return tonateAddressList;
}

export async function scanTonateContractAddressAll() {
  const tonatetrackerAddress = TONATE_TRACKER_WALLET_ADDRESS;
  // Get all trasactions of TonateTrackerWallet
  const transactions = await getTransactions(tonatetrackerAddress);
  // Parse all smartcontract address of transactions towared TonateTrackerWallet
  const tonateIncommingAddress = await parseTonateTransactions(transactions);
  // Filter only Tonate smartcontract from all incoming address by calling tonate specific caller
  const tonateIncomingSmartcontractAddress = await filterTonateAddress(
    tonateIncommingAddress
  );

  console.log("Tonate address is retreived");
  return tonateIncomingSmartcontractAddress;
}

// scanTonateContractAddressAll();
