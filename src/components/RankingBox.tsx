import { FC } from "react";
import clsx from "clsx";
import { useTonConnect } from "@/hooks/useTonConnect";
import { Tonate } from "@/types";

import styles from "./RankingBox.module.css";

interface RankingBoxProps {
  rankOrder: number;
  tonate: Tonate;
  isLogin: boolean;
  onClickReceiveTon: (isSuccess: boolean) => void;
}

export const RankingBox: FC<RankingBoxProps> = ({
  rankOrder,
  tonate,
  isLogin,
  onClickReceiveTon,
}) => {
  const connector = useTonConnect();

  const receiveTonate = async () => {
    if (!isLogin) {
      onClickReceiveTon(false);

      return;
    }

    await tonate.sendReceiveTon();
    onClickReceiveTon(true);
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
