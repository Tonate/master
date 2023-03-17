import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { scanContractAddressMypageRecieved } from "@/helpers/tonScan";
import { ReceivedTonateList } from "@/components/ReceivedTonateList";
import { LeftArrow, Spinner } from "@/components/icon";
import { useTonWallet } from "@tonconnect/ui-react";

import styles from "./TonateHistoryPage.module.css";

export function TonateHistoryPage() {
  const navigate = useNavigate();
  const wallet = useTonWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [
    receivedTonateContractAddressList,
    setReceivedTonateContractAddressList,
  ] = useState<string[]>([]);

  const routeToMainPage = () => {
    navigate("/");
  };

  useEffect(() => {
    async function scanRecievedContractAddress() {
      setIsLoading(true);
      const tonateAddressList = await scanContractAddressMypageRecieved(
        wallet?.account.address ?? ""
      );

      console.log(tonateAddressList);

      setReceivedTonateContractAddressList(tonateAddressList);
      setIsLoading(false);
    }
    scanRecievedContractAddress();
  }, [wallet]);

  return (
    <div className={styles.tonateHistoryPage}>
      <div className={styles.gnb}>
        <div className={styles.leftArrow} onClick={routeToMainPage}>
          <LeftArrow />
        </div>
      </div>
      <div className={styles.title}>Receive List</div>

      <ReceivedTonateList
        tonateAddressList={receivedTonateContractAddressList}
      />

      {isLoading && (
        <div className={styles.loading}>
          <Spinner />
        </div>
      )}
    </div>
  );
}
