import { useEffect, useState } from "react";
import { Address, OpenedContract } from "ton-core";
import Tonate from "../contracts/tonate";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";

export function useTonateContract(tonateAddress: string) {
  const client = useTonClient();
  const [val, setVal] = useState<number>(0);
  const { sender } = useTonConnect();

  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  const tonateContract = useAsyncInitialize(async () => {
    if (!client) return;

    const contract = new Tonate(Address.parse(tonateAddress));
    return client.open(contract) as OpenedContract<Tonate>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!tonateContract) return;

      const val = await tonateContract.getBalance();
      setVal(Number(val));

      await sleep(10000);

      getValue();
    }
    getValue();
  }, [tonateContract]);

  return {
    value: val,
    address: tonateContract?.address.toString(),
    sendReceiveTon: () => {
      return tonateContract?.sendReceiveTon(sender);
    },
    sendWithdrawAll: () => {
      return tonateContract?.sendWithdrawAll(sender);
    },
    sendMoney: () => {
      return tonateContract?.sendMoney(sender);
    },
  };
}
