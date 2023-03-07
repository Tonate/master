import { useEffect, useState } from "react";
import { Address, OpenedContract } from "ton-core";
import Counter from "../contracts/counter";
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
            Address.parse("EQAtii2cWTG_9k9wIfFSF-Tg1ZSl3jTa8SWyUuJ7VY76iLNj")
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
        tonateEat: () => {
            return tonateContract?.sendEat(sender);
        },
        withrawAll: () => {
            return tonateContract?.sendWithdrawAll(sender);
        },
        sendMoney: () => {
            return tonateContract?.sendMoney(sender);
        }
    }
}