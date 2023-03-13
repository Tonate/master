import { FC } from "react";
import { useTonConnect } from "../hooks/useTonConnect";
import { useTonateContract } from "../hooks/userTonateContract";

import styles from "./RankingBox.module.css";

interface RankingBoxProps {
  rankOrder: number;
  tonateAddress: string;
}

export const RankingBox: FC<RankingBoxProps> = ({
  rankOrder,
  tonateAddress,
}) => {
  const connector = useTonConnect();
  const tonate = useTonateContract(tonateAddress);

  const receiveTonate = async () => {
    console.log("receiveTonate");
    console.log(connector);
    console.log(tonate);
    await tonate.sendReceiveTon();
  };

  return (
    <div className={styles.rankingbox}>
      <div className={styles.infoArea}>
        <div className={styles.firstRankedTonateImage}></div>
        <div className={styles.tonateInfo}>
          <span title={tonateAddress}>{tonateAddress}</span>
          <span>@qwe</span>
        </div>
      </div>
      <div className={styles.amountArea}>
        <span>Total Tonate</span>
        <div>
          <div className={styles.tonIcon}></div>
          <span className={styles.tonateAmount}>{`${tonate.value} TON`}</span>
        </div>
        <button className={styles.receiveButton} onClick={receiveTonate}>
          Receive TON
        </button>
      </div>
    </div>
  );
};
