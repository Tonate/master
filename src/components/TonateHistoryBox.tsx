import { FC } from "react";

import styles from "./TonateHistoryBox.module.css";

interface TonateHistoryBoxProps {
  tonateHistory: any;
}

export const TonateHistoryBox: FC<TonateHistoryBoxProps> = ({
  tonateHistory,
}) => {
  return (
    <div className={styles.tonateHistoryBox}>
      <div>
        <div className={styles.tonImage}></div>
        <div className={styles.tonateInfo}>
          <span>채팅방이름?</span>
          <span>EQD2...G2IN</span>
          <span>500 TON | 30 person</span>
        </div>
      </div>
    </div>
  );
};
