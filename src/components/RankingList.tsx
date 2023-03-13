import { FC } from "react";
import { RankingBox } from "./RankingBox";

import styles from "./RankingList.module.css";

interface RankingListProps {
  tonateAddressList: string[];
}

export const RankingList: FC<RankingListProps> = ({ tonateAddressList }) => {
  return (
    <div className={styles.rankingList}>
      <div className={styles.rankingListHeader}>
        <span>TONate Ranking</span>
        <span>
          the TONate bot In the chat room, Have an unexpected good luck!
        </span>
      </div>
      <div className={styles.rankingListBody}>
        {tonateAddressList.map((tonateAddress, index) => {
          return (
            <RankingBox
              key={tonateAddress}
              rankOrder={index}
              tonateAddress={tonateAddress}
            />
          );
        })}
      </div>
    </div>
  );
};
