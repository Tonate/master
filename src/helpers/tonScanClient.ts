import { getHttpEndpoint } from '@orbs-network/ton-access';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { TonClient } from 'ton';
import { Address } from 'ton-core';
import Tonate from '../contracts/tonate';

const TONSCAN_API_URL = "https://testnet.tonapi.io/v1/blockchain"
const TONATE_TRACKER_WALLET_ADDRESS = "EQD95aQy4L1JhesahCd4broGOY4XNoxdkIDp-t12usfcgy1_";

async function main () {
    const client = new TonClient({
        endpoint: await getHttpEndpoint({ network: 'testnet' }),
      })
      
      const transactions = await client.getTransactions(Address.parse(TONATE_TRACKER_WALLET_ADDRESS), {limit: 5});
      
      console.log(transactions);
}

main();

