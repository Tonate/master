import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { WalletInfo } from "@/types";
import { TonateHistoryBox } from "./TonateHistoryBox";

import styles from "./WalletInfoBox.module.css";

interface WalletInfoBoxProps {
  walletInfo: WalletInfo;
  tonateAddressList: string[];
}

export const WalletInfoBox: FC<WalletInfoBoxProps> = ({
  walletInfo,
  tonateAddressList,
}) => {
  const navigate = useNavigate();

  const {
    balance: { ton, dollar },
  } = walletInfo;

  const routeToSendTonateHistoryPage = () => {
    navigate("/history");
  };

  const routeToSendTonPage = () => {
    navigate("/send");
  };

  return (
    <div className={styles.walletInfoBox}>
      <div className={styles.walletInfo}>
        <div>
          <span>Total balance</span>
          <span>{`${ton} TON`}</span>
          <span>{`$${dollar}`}</span>
        </div>
        <div className={styles.profileImage}></div>
      </div>

      <div className={styles.memberTonateHistory}>
        <div className={styles.header}>
          <span>TONate History</span>
          <span
            className={styles.moreButton}
            onClick={routeToSendTonateHistoryPage}
          >
            {"More>"}
          </span>
        </div>
        <div className={styles.histories}>
          {tonateAddressList.map((tonateAddress) => {
            return (
              <TonateHistoryBox
                key={tonateAddress}
                tonateAddress={tonateAddress}
              ></TonateHistoryBox>
            );
          })}
        </div>
      </div>

      <button className={styles.sendTonButton} onClick={routeToSendTonPage}>
        Send TON
      </button>
    </div>
  );
};
