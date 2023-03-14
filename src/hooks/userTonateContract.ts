import { useEffect, useState } from "react";
import { Address, OpenedContract } from "ton-core";
import Tonate from "../contracts/tonate";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";

export function useTonateContract(tonateAddress: string) {
  const client = useTonClient();
  const [tonateValue, setTonateValue] = useState<number>(0);
  const [tonateTitle, setTonateTitle] = useState<string>("");
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

      const value = await tonateContract.getBalance();
      const title = await tonateContract.getTitle();
      setTonateValue(Number(value));
      setTonateTitle(title.replace("\x00\x00\x00\x00", ""));

      await sleep(10000);

      getValue();
    }
    getValue();
  }, [tonateContract]);

  return {
    value: tonateValue,
    title: tonateTitle,
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
