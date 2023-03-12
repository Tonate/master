import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "ton";
import Tonate from "./contract/tonate"; // this is the interface class we just implemented

async function main() {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // open Counter instance by address
  const tonateAddress = Address.parse("EQDq2k_egGfp7drL12nBp_pMCQocddIM-2HImmtJHD01Te5l");
  const tonate = new Tonate(tonateAddress);
  const tonateContract = client.open(tonate);

  const balanceValue = await tonateContract.getBalance();
  console.log("balanceValue:", balanceValue.toString());

  const ownerAddress = await tonateContract.getAddress();
  console.log("ownerAddress:", ownerAddress.toString());
}

main();
