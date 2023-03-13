import { WalletInfo } from "../types";
import { WalletInfoBox } from "./WalletInfoBox";
import { RankingList } from "./RankingList";
import { useTonWallet } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";

import styles from "./TonatePage.module.css";
import { LoginBox } from "./LoginBox";
import { scanTonateContractAddressAll } from "../helpers/tonScan";
import { Spinner } from "./icon/Spinner";

export function TonatePage() {
  const wallet = useTonWallet();
  const [tonateAddressList, setTonateAddressList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const walletInfo: WalletInfo = {
    totalBalance: 123.1,
    dollar: 369.3,
    tonateHistoryList: [1, 2],
  };

  useEffect(() => {
    async function scanTonateContractAddress() {
      setIsLoading(true);
      const tonateAddressList = await scanTonateContractAddressAll();

      setTonateAddressList(tonateAddressList);
      setIsLoading(false);
    }

    scanTonateContractAddress();
  }, []);

  return (
    <div className={styles.tonatePage}>
      <span className={styles.title}>TONate</span>

      {wallet?.account.chain ? (
        <WalletInfoBox walletInfo={walletInfo} />
      ) : (
        <LoginBox></LoginBox>
      )}

      <RankingList tonateAddressList={tonateAddressList}></RankingList>

      {isLoading && (
        <div className={styles.loading}>
          <Spinner />
        </div>
      )}
    </div>
  );
}
