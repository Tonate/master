import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTonWallet } from "@tonconnect/ui-react";
import { useTonClient } from "@/hooks/useTonClient";
import { useTonConnect } from "@/hooks/useTonConnect";
import { Checkbox, LeftArrow, SelectedCheckbox } from "@/components/icon";
import { Toggle, TonateConfirmModal } from "@/components";
import { deployTonate } from "@/helpers/deployTonate";
import { Address } from "ton-core";

import styles from "./SendTonPage.module.css";
import { DeployTonateDto } from "@/helpers/deploy.dto";

export function SendTonPage() {
  const navigate = useNavigate();
  const client = useTonClient();
  const wallet = useTonWallet();
  const { sender } = useTonConnect();
  const [balance, setBalance] = useState("");
  const [createdTonateUrl, setCreatedTonateUrl] = useState("");
  const [isVisibleConfirmModal, setIsVisibleConfirmModal] = useState(false);
  const [gasFee, _] = useState(0.0001);
  const [amount, setAmount] = useState(0.0);
  const [person, setPerson] = useState(0);
  const [isPublic, setIsPublic] = useState(true);
  const [isRandom, setIsRandom] = useState(true);

  useEffect(() => {
    getBalance(wallet?.account.address ?? "");
  }, [client, wallet]);

  const getBalance = async (address: string) => {
    const nanoTon = await client?.getBalance(Address.parse(address));

    setBalance(
      (Number.parseFloat(nanoTon?.toString()!) / 1000000000).toFixed(3)
    );
  };

  const routeToMainPage = () => {
    navigate("/");
  };

  const createTonate = async () => {
    console.log("톤 뿌리기 시작!");
    // @TODO - 톤 뿌리기 스컨 생성 후 메인화면으로 전송
    // create tonate API

    const deployTonateDto: DeployTonateDto = {
      title: "New Tonate!",
      userNumber: person,
      method: isRandom ? "random" : "split",
      visibility: isPublic ? "public" : "private",
      balance: amount,
    };

    console.log(deployTonateDto);

    const walletContract = await deployTonate(sender, deployTonateDto);

    console.log("톤 뿌리기 완!");

    console.log(walletContract.toString());

    setCreatedTonateUrl("/share " + walletContract);
    setIsVisibleConfirmModal(true);
    // navigate('/')
  };

  const selectPublic = () => {
    setIsPublic(true);
  };

  const selectPrivate = () => {
    setIsPublic(false);
  };

  const changeMethod = (isRandom: boolean) => {
    setIsRandom(isRandom);
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
        <div>
          {/* {isPublic && <SelectedCheckbox />} */}
          <input type="radio" checked={isPublic} onClick={selectPublic} />
          <span>Public</span>
          <div style={{width: 16}}/>
          <input type="radio" checked={!isPublic} onClick={selectPrivate} />
          <span>Private</span>
        </div>
        <div className={styles.quantity}>
          <span>Quantity</span>
          <div className={styles.sendTonateInput}>
            <input
              type="number"
              onChange={(v) => {
                setPerson(Number(v.target.value));
              }}
              defaultValue={person}
            ></input>
            <div className={styles.placeholder}>person</div>
          </div>
        </div>
        <div className={styles.amount}>
          <span>Amount</span>
          <div className={styles.sendTonateInput}>
            <input
              type="number"
              onChange={(v) => {
                setAmount(Number(v.target.value));
              }}
              defaultValue={amount}
            ></input>
            <div className={styles.placeholder}>TON</div>
          </div>
        </div>
        <div className={styles.method}>
          <span>Method</span>
          <Toggle
            leftText="Random"
            rightText="Split"
            onChangeSelect={changeMethod}
          />
        </div>
      </div>

      <div className={styles.tonateSummary}>
        <div>
          <span>Gas Fee</span>
          <span>{gasFee} TON</span>
        </div>
        <hr />
        <div>
          <span>TOTAL</span>
          <span>{gasFee + amount} TON</span>
        </div>
      </div>

      <button className={styles.dropButton} onClick={createTonate}>
        DROP
      </button>

      <TonateConfirmModal
        tonateUrl={createdTonateUrl}
        isOpen={isVisibleConfirmModal}
        onClickConfirm={routeToMainPage}
      />
    </div>
  );
}
