import { WalletInfo } from "../types";
import { WalletInfoBox } from "./WalletInfoBox";
import { RankingList } from "./RankingList";
import { useTonWallet } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";

import styles from "./TonatePage.module.css";
import { LoginBox } from "./LoginBox";
import { scanTonateContractAddressAll } from "../helpers/tonScan";
import { Spinner } from "./icon/Spinner";
import { useTonClient } from "../hooks/useTonClient";
import { Address } from "ton-core";
import { TonateLogo } from "./icon/TonateLogo";

export function TonatePage() {
  const client = useTonClient();
  const wallet = useTonWallet();
  const [tonateContractAddressList, setTonateContractAddressList] = useState<
    string[]
  >([]);
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    balance: { ton: "0", dollar: "0" },
    tonateHistoryList: [1, 2],
  });
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // https://tonate.github.io/master/{addess} URL에 딸려오는 쿼리 스트링으로 바로 받기
  // TONate 주소가 접근한 URL에 존재하면 그 친구만 보여주기
  // const tonateContractAddress = window.location.href;

  useEffect(() => {
    async function getWalletInfo() {
      // @TODO - API 호출 횟수 제한으로 일단 상수로 대체
      const tonCoinMarketValue = {
        quotes: {
          USD: {
            price: 2.4,
          },
        },
      };

      //   await fetch(
      //   "https://api.coinpaprika.com/v1/tickers?quotes=USD"
      // )
      //   .then((response) => response.json())
      //   .then((result) =>
      //     result.find((coin: any) => coin.id === "toncoin-the-open-network")
      //   );

      const nanoTon = await client?.getBalance(
        Address.parse(wallet?.account.address!)
      );

      const myTon = Number.parseFloat(nanoTon?.toString()!) / 1000000000;
      const myDollar = (myTon * tonCoinMarketValue.quotes.USD.price).toFixed(2);

      setWalletInfo({
        ...walletInfo,
        balance: { ton: myTon.toFixed(3), dollar: myDollar },
      });
    }

    if (wallet?.account) {
      setIsLogin(true);
      getWalletInfo();
    } else {
      setIsLogin(false);
    }
  }, [wallet]);

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
      <div className={styles.title}>
        <TonateLogo />
        <span>TONate</span>
      </div>

      {isLogin ? (
        <WalletInfoBox walletInfo={walletInfo} />
      ) : (
        <LoginBox></LoginBox>
      )}

      <RankingList
        tonateAddressList={tonateContractAddressList}
        isLogin={isLogin}
      ></RankingList>

      {isLoading && (
        <div className={styles.loading}>
          <Spinner />
        </div>
      )}
    </div>
  );
}