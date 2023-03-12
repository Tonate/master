import { FC } from "react";
import { TonateInfo } from "../types";
import { useTonConnect } from "../hooks/useTonConnect";
import { useTonateContract } from "../hooks/userTonateContract";

import styles from "./RankingBox.module.css";

interface RankingBoxProps {
  tonateInfo: TonateInfo;
}

export const RankingBox: FC<RankingBoxProps> = ({ tonateInfo }) => {
  const connector = useTonConnect();
  const testTonate = useTonateContract();
  const { address, amount } = tonateInfo;

  const receiveTonate = async () => {
    console.log("receiveTonate");
    console.log(connector);
    console.log(testTonate);
    await testTonate.tonateEat();
  };

  return (
    <div className={styles.rankingbox}>
      <div className={styles.infoArea}>{address}</div>
      <div className={styles.amountArea}>
        <span>Total Tonate</span>
        <div>
          <div className={styles.tonIcon}></div>
          <span
            className={styles.tonateAmount}
          >{`${testTonate.value} TON`}</span>
        </div>
        <button className={styles.receiveButton} onClick={receiveTonate}>
          Receive TON
        </button>
      </div>
    </div>
  );
};
