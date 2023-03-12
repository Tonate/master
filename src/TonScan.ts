import { getHttpEndpoint } from '@orbs-network/ton-access';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { TonClient } from 'ton';
import { Address } from 'ton-core';
import Tonate from './contract/tonate';

const TONSCAN_API_URL = "https://testnet.tonapi.io/v1/blockchain"
const TONATE_TRACKER_WALLET_ADDRESS = "EQD95aQy4L1JhesahCd4broGOY4XNoxdkIDp-t12usfcgy1_";

interface in_msg_ton{
    destination: addressTon;
    source: addressTon;
}

interface addressTon{
    address: string;
    isScam: boolean;
}

interface trasactionDto{
    account : addressTon;
    in_msg : in_msg_ton;
}

// axios http client
async function getData(url: string): Promise<any> {
    try {
      const config: AxiosRequestConfig = {
        url: url,
        method: 'get'
      };
      const response: AxiosResponse = await axios(config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

// Get all trasactions of TonateTrackerWallet
async function getTransactions(address : String){    
    var transactions;
    try{
        transactions = await getData(`${TONSCAN_API_URL}/getTransactions?account=${address}`);
    } catch(e){
        console.error(e);
    }
    return transactions["transactions"];
}

// Get all smartcontract address of transactions towared TonateTrackerWallet
async function parseTonateTransactions(transactions : Array<trasactionDto>){
   let incomingAddressList : Array<string> = [];

    transactions.forEach(trx => {
        const address = trx?.in_msg?.source?.address;
        if(address){
          incomingAddressList.push(address);
        }  
   });
   console.log("[Incoming Address List]");
   console.log(incomingAddressList);
   return incomingAddressList;
}

// Filter only Tonate smartcontract from all incoming address by calling tonate specific caller
  // if the smartconract doesn't provide that caller, then it is not a tonate smartcontract
async function filterTonateAddress(incomingAddressList : Array<string>){
  
  let tonateAddressList : Array<string> = [];
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  for (const address of incomingAddressList) {
    if(address){
      const contractAddress = Address.parse(address);
      const tonate = new Tonate(contractAddress);
      const tonateContract = client.open(tonate);
      let counter;
      try{
        counter = await tonateContract.getCounter();
      }
      catch(e){
        // console.log(e);
      }
      if (counter == BigInt(0)){
        tonateAddressList.push(address);
      }
    }
  }
  console.log("[Tonate SmartContract Address List]");
  console.log(tonateAddressList);
   return tonateAddressList
}

async function main() {
    const tonatetrackerAddress = TONATE_TRACKER_WALLET_ADDRESS;
    // Get all trasactions of TonateTrackerWallet
    const transactions = await getTransactions(tonatetrackerAddress);
    // Parse all smartcontract address of transactions towared TonateTrackerWallet
    const tonateIncommingAddress = await parseTonateTransactions(transactions);
    // Filter only Tonate smartcontract from all incoming address by calling tonate specific caller
    const tonateIncomingSmartcontractAddress = await filterTonateAddress(tonateIncommingAddress);

    console.log("Tonate address is retreived");
}

main();

/*
{
  account: {
    address: '0:2d8a2d9c5931bff64f7021f15217e4e0d594a5de34daf125b252e27b558efa88',
    is_scam: false
  },
  data: 'b5ee9c72010210010002650003b572d8a2d9c5931bff64f7021f15217e4e0d594a5de34daf125b252e27b558efa880000088ce8317903000000000000000000000000000000000000000000000000000000000000000000000000000000006405f5790001c60f78f08010c0d0101a00202b148015957c0274ed71c4da04ad7d81dc3e459ae78f3b53530b357b5ea21c01f784a59000b628b67164c6ffd93dc087c5485f938356529778d36bc496c94b89ed563bea21004c4b400064437ae00001119d062f204c80beaf319030b0114ff00f4a413f4bcf2c80b0402016205080202ce060700b343221c700915be001d31f3001d0d30331fa403021c0019b31f8276f22307aa904f003e001c0028e2eed44d0fa40d33f303020f90102f90112ba8e1870208018c8cb055003cf1621fa0212cb6acb1fc98306fb009130e29130e2800275708018c8cb055003cf1601fa02cb6ac973fb008020120090a0017bc73076a2687d20699f98184000fbcb607c13b79118400538015957c0274ed71c4da04ad7d81dc3e459ae78f3b53530b357b5ea21c01f784a580000030d6e8d9083000827290aec8965afabb16ebc3cb9b408ebae71b618d78788bc80d09843593cac98da4e1a13013c4d99ce64b956f0425caf1fc527a51116ce1ff41ff560bb8c428d91102150c09004c4b401860f78f110e0f009c403f69388000000000000000000a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005bc00000000000000000000000012d452da449e50b8cf7dd27861f146122afe1b546bb8b70fc8216f0c614139f8e04',
  fee: 507000,
  hash: 'b0f8ce4e2e02c383c6b686e4118d9d1d31f7f3301490f88ce34ccc5067a8c90b',
  in_msg: {
    created_lt: 9401284000002,
    destination: {
      address: '0:2d8a2d9c5931bff64f7021f15217e4e0d594a5de34daf125b252e27b558efa88',
      is_scam: false
    },
    fwd_fee: 2235351,
    ihr_fee: 0,
    msg_data: '',
    source: {
      address: '0:acabe013a76b8e26d0256bec0ee1f22cd73c79da9a9859abdaf510e00fbc252c',
      is_scam: false
    },
    value: 20000000
  },
  lt: 9401284000003,
  other_fee: 507000,
  out_msgs: [],
  storage_fee: 0,
  utime: 1678112121
*/