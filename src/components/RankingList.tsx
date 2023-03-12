import { FC } from "react";
import { TonateInfo } from "../types";
import { RankingBox } from "./RankingBox";

import styles from "./RankingList.module.css";

interface RankingListProps {
  tonateList: TonateInfo[];
}

export const RankingList: FC<RankingListProps> = ({ tonateList }) => {
  return (
    <div className={styles.rankingList}>
      <div className={styles.rankingListHeader}>
        <span>TONate Ranking</span>
        <span>
          the TONate bot In the chat room, Have an unexpected good luck!
        </span>
      </div>
      <div className={styles.rankingListBody}>
        {tonateList.map((tonate) => {
          return <RankingBox key={tonate.address} tonateInfo={tonate} />;
        })}
      </div>
    </div>
  );
};
