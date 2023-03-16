import { useTonWallet } from "@tonconnect/ui-react";
import { useTonClient } from "../hooks/useTonClient";
import { LeftArrow, TonateLogo } from "./icon";

import styles from "./SendTonPage.module.css";

export function SendTonPage() {
  const client = useTonClient();
  const wallet = useTonWallet();

  return (
    <div className={styles.sendTonPage}>
      <div className={styles.gnb}>
        <div className={styles.leftArrow}>
          <LeftArrow />
        </div>
      </div>

      <div className={styles.title}>
        <span>Tonate</span>
        <div className={styles.logo}></div>
      </div>

      <div className={styles.sendTonateInfoBox}>
        <div className={styles.quantity}>
          <span>Quantity</span>
          <div className={styles.sendTonateInput}>
            <input type="text"></input>
            <div className={styles.placeholder}>person</div>
          </div>
        </div>
        <div className={styles.amount}>
          <span>Amount</span>
          <div className={styles.sendTonateInput}>
            <input type="text"></input>
            <div className={styles.placeholder}>TON</div>
          </div>
        </div>
        <div className={styles.method}></div>
      </div>

      <div className={styles.tonateSummary}>
        <div>
          <span>Gas Fee</span>
          <span>0.3 TON</span>
        </div>
        <hr />
        <div>
          <span>TOTAL</span>
          <span>30.3 TON</span>
        </div>
      </div>

      <button className={styles.dropButton}>DROP</button>
    </div>
  );
}
