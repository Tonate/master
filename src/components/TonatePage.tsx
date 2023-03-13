import { Tonate, WalletInfo } from "../types";
import { WalletInfoBox } from "./WalletInfoBox";
import { RankingList } from "./RankingList";
import { useTonWallet } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";

import styles from "./TonatePage.module.css";
import { LoginBox } from "./LoginBox";
import { scanTonateContractAddressAll } from "../helpers/tonScan";
import { Spinner } from "./icon/Spinner";
import { useTonateContract } from "../hooks/userTonateContract";

export function TonatePage() {
  const wallet = useTonWallet();
  const [tonateContractAddressList, setTonateContractAddressList] = useState<
    string[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // https://tonate.github.io/master/{addess} URL에 딸려오는 쿼리 스트링으로 바로 받기
  // TONate 주소가 접근한 URL에 존재하면 그 친구만 보여주기
  // const tonateContractAddress = window.location.href;

  const walletInfo: WalletInfo = {
    totalBalance: 123.1,
    dollar: 369.3,
    tonateHistoryList: [1, 2],
  };

  useEffect(() => {
    async function scanTonateContractAddress() {
      setIsLoading(true);

      const tonateAddressList = await scanTonateContractAddressAll();

      setTonateContractAddressList(tonateAddressList);
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

      <RankingList tonateAddressList={tonateContractAddressList}></RankingList>

      {isLoading && (
        <div className={styles.loading}>
          <Spinner />
        </div>
      )}
    </div>
  );
}
