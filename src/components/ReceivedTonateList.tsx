import { useTonateContract } from "@/hooks/userTonateContract";
import { Tonate } from "@/types";
import { FC } from "react";
import { ReceivedTonateBox } from "./ReceivedTonateBox";

import styles from "./ReceivedTonateList.module.css";

interface ReceivedTonateListProps {
  tonateAddressList: string[];
}

export const ReceivedTonateList: FC<ReceivedTonateListProps> = ({
  tonateAddressList,
}) => {
  const tonateList: Tonate[] = tonateAddressList.map((address) => {
    return useTonateContract(address);
  });

  return (
    <div className={styles.receivedTonateList}>
      {tonateList.map((tonate) => (
        <ReceivedTonateBox key={tonate.address} tonate={tonate} />
      ))}
    </div>
  );
};
