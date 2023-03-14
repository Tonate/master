import { FC } from "react";
import { useTonConnect } from "../hooks/useTonConnect";
import clsx from "clsx";

import styles from "./RankingBox.module.css";
import { Tonate } from "../types";

interface RankingBoxProps {
  rankOrder: number;
  tonate: Tonate;
  isLogin: boolean;
}

export const RankingBox: FC<RankingBoxProps> = ({
  rankOrder,
  tonate,
  isLogin,
}) => {
  const connector = useTonConnect();

  const receiveTonate = async () => {
    console.log("receiveTonate");
    console.log(connector);
    console.log(tonate);
    if (!isLogin) {
      // @TODO - 지갑 연결하라는 모달 띄우기
      console.error("wallet was not connected");
      return;
    }
    await tonate.sendReceiveTon();
  };

  return (
    <div className={styles.rankingbox}>
      {rankOrder === 1 && (
        <div className={styles.secondRankedTonateProfileMedal}></div>
      )}
      {rankOrder === 2 && (
        <div className={styles.thirdRankedTonateProfileMedal}></div>
      )}
      <div className={clsx(styles.infoArea)}>
        <div
          className={clsx(
            rankOrder === 0
              ? styles.firstRankedTonateProfileImage
              : styles.tonateRankingProfile
          )}
        ></div>
        <div className={styles.tonateInfo}>
          <span title={tonate.address}>{tonate.title}</span>
          <span>{tonate.address}</span>
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
