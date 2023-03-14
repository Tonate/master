import { FC } from "react";
import { useTonateContract } from "../hooks/userTonateContract";
import { Tonate } from "../types";
import { RankingBox } from "./RankingBox";

import styles from "./RankingList.module.css";

interface RankingListProps {
  tonateAddressList: string[];
  isLogin: boolean;
}

export const RankingList: FC<RankingListProps> = ({
  tonateAddressList,
  isLogin,
}) => {
  const tonateList: Tonate[] = tonateAddressList
    .map((address) => {
      return useTonateContract(address);
    })
    .sort((t1, t2) => t2.value - t1.value);

  return (
    <div className={styles.rankingList}>
      <div className={styles.rankingListHeader}>
        <span>TONate Ranking</span>
        <span>
          the TONate bot In the chat room, Have an unexpected good luck!
        </span>
      </div>
      <div className={styles.rankingListBody}>
        {tonateList.map((tonate, index) => {
          return (
            <RankingBox
              key={tonate.address ?? index}
              rankOrder={index}
              tonate={tonate}
              isLogin={isLogin}
            />
          );
        })}
      </div>
    </div>
  );
};
