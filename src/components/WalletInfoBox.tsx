import { FC } from "react";
import { WalletInfo } from "../types";
import { TonateHistoryBox } from "./TonateHistoryBox";

import styles from "./WalletInfoBox.module.css";

interface WalletInfoBoxProps {
  walletInfo: WalletInfo;
}

export const WalletInfoBox: FC<WalletInfoBoxProps> = ({ walletInfo }) => {
  const { totalBalance, dollar, tonateHistoryList } = walletInfo;

  return (
    <div className={styles.walletInfoBox}>
      <div className={styles.walletInfo}>
        <div>
          <span>Total balance</span>
          <span>{`${totalBalance}TON`}</span>
          <span>{`$${dollar}`}</span>
        </div>
        <div className={styles.profileImage}></div>
      </div>

      <div className={styles.memberTonateHistory}>
        <div>
          <span>TONate History</span>
          <span>
            <a>{"More>"}</a>
          </span>
        </div>
        <div>
          {tonateHistoryList.map((tonateHistory: number) => {
            return (
              <TonateHistoryBox
                key={tonateHistory}
                tonateHistory={tonateHistory}
              ></TonateHistoryBox>
            );
          })}
        </div>
      </div>
    </div>
  );
};
