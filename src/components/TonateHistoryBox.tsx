import { useTonateContract } from "@/hooks/userTonateContract";
import { Tonate } from "@/types";
import { FC } from "react";

import styles from "./TonateHistoryBox.module.css";

interface TonateHistoryBoxProps {
  tonateAddress: string;
}

export const TonateHistoryBox: FC<TonateHistoryBoxProps> = ({
  tonateAddress,
}) => {
  const tonate = useTonateContract(tonateAddress);

  console.log(tonate);

  return (
    <div className={styles.tonateHistoryBoxWrapper}>
      <div className={styles.tonateHistoryBox}>
        <div className={styles.tonImage}></div>
        <div className={styles.tonateInfo}>
          <span>{tonate.title}</span>
          <span>{tonate.address}</span>
          {/* tonate 받은 금액  */}
          {/* <span>500 TON</span> */}
        </div>
      </div>
    </div>
  );
};
