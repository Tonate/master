import { WalletInfo, TonateInfo } from "../types";
import { WalletInfoBox } from "./WalletInfoBox";
import { RankingList } from "./RankingList";
import { useTonWallet } from "@tonconnect/ui-react";
import { Button } from "./styled/styled";
import { useTonConnect } from "../hooks/useTonConnect";
import TonConnect from "@tonconnect/sdk";

import styles from "./TonatePage.module.css";
import { LoginBox } from "./LoginBox";

interface TonatePageProps {}

export function TonatePage<TonatePageProps>() {
  const connector = useTonConnect();
  const wallet = useTonWallet();

  const walletInfo: WalletInfo = {
    totalBalance: 123.1,
    dollar: 369.3,
    tonateHistoryList: [1, 2],
  };
  const tonateList: TonateInfo[] = [
    {
      address: "address1",
      amount: 2000,
    },
  ];

  return (
    <div className={styles.tonatePage}>
      <span className={styles.title}>TONate</span>

      {wallet?.account.chain ? (
        <WalletInfoBox walletInfo={walletInfo} />
      ) : (
        <LoginBox></LoginBox>
      )}

      <RankingList tonateList={tonateList}></RankingList>
    </div>
  );
}
