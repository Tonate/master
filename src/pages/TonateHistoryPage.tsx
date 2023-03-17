import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTonWallet } from "@tonconnect/ui-react";
import { useTonClient } from "@/hooks/useTonClient";
import { LeftArrow } from "@/components/icon";
import { ReceivedTonateBox } from "@/components";

import styles from "./TonateHistoryPage.module.css";

export function TonateHistoryPage() {
  const navigate = useNavigate();
  const client = useTonClient();
  const wallet = useTonWallet();
  const [createdTonateUrl, setCreatedTonateUrl] = useState("");
  const [isVisibleConfirmModal, setIsVisibleConfirmModal] = useState(false);

  const routeToMainPage = () => {
    navigate("/");
  };

  useEffect(() => {}, []);

  return (
    <div className={styles.tonateHistoryPage}>
      <div className={styles.gnb}>
        <div className={styles.leftArrow} onClick={routeToMainPage}>
          <LeftArrow />
        </div>
      </div>

      <div className={styles.title}>Receive List</div>

      {/* <ReceivedTonateBox /> */}
    </div>
  );
}
