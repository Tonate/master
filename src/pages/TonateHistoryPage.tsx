import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { scanTonateContractAddressAll } from "@/helpers/tonScan";
import { ReceivedTonateList } from "@/components/ReceivedTonateList";
import { LeftArrow, Spinner } from "@/components/icon";

import styles from "./TonateHistoryPage.module.css";

export function TonateHistoryPage() {
  const navigate = useNavigate();
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
      const tonateAddressList = await scanTonateContractAddressAll();

      setReceivedTonateContractAddressList(tonateAddressList);
      setIsLoading(false);
    }
    scanRecievedContractAddress();
  }, []);

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
