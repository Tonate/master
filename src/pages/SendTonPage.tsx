import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTonWallet } from "@tonconnect/ui-react";
import { useTonClient } from "@/hooks/useTonClient";
import { LeftArrow } from "@/components/icon";
import { Toggle, TonateConfirmModal } from "@/components";
import { deploy } from "@/helpers/deployTonate";

import styles from "./SendTonPage.module.css";

export function SendTonPage() {
  const navigate = useNavigate();
  const client = useTonClient();
  const wallet = useTonWallet();
  const [createdTonateUrl, setCreatedTonateUrl] = useState("");
  const [isVisibleConfirmModal, setIsVisibleConfirmModal] = useState(false);

  const routeToMainPage = () => {
    navigate("/");
  };

  const createTonate = async () => {
    console.log("톤 뿌리기 시작!");
    // @TODO - 톤 뿌리기 스컨 생성 후 메인화면으로 전송
    // create tonate API
    const walletContract = await deploy();

    console.log("톤 뿌리기 완!");

    console.log(walletContract);

    setCreatedTonateUrl("https://tonate.io/내가만든쿠키/너를위해구웠지");
    setIsVisibleConfirmModal(true);
    // navigate('/')
  };

  return (
    <div className={styles.sendTonPage}>
      <div className={styles.gnb}>
        <div className={styles.leftArrow} onClick={routeToMainPage}>
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
        <div className={styles.method}>
          <span>Method</span>
          <Toggle leftText="Random" rightText="Split" />
        </div>
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

      <button className={styles.dropButton} onClick={createTonate}>
        DROP
      </button>

      <TonateConfirmModal
        tonateUrl={createdTonateUrl}
        isOpen={isVisibleConfirmModal}
        onClickConfirm={setIsVisibleConfirmModal}
      />
    </div>
  );
}
