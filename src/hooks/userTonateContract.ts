import { useEffect, useState } from "react";
import { Address, OpenedContract } from "ton-core";
import Tonate from "../contracts/tonate";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";

export function useTonateContract() {
    const client = useTonClient();
    const [val, setVal] = useState<null | number>();
    const {sender} = useTonConnect();

    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

    const tonateContract = useAsyncInitialize(async () => {
        if(!client) return;
        const contract = new Tonate(
            Address.parse("EQCPdT2FlilyIugK6xsmZiPz8XvX2W7expA7d9PSn-vgz3wn")
            );
        return client.open(contract) as OpenedContract<Tonate>;
    }, [client]);

    useEffect( () => {
        async function getValue() {
            if (!tonateContract) return;
            setVal(null);
            const val = await tonateContract.getBalance();
            setVal(Number(val));
            await sleep(5000);
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
        }
    }
}