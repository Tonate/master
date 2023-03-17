import { Tonate } from "@/types";
import { FC } from "react";
import { PrivateChip } from "./icon/PrivateChip";

import styles from "./ReceivedTonateBox.module.css";

interface ReceivedTonateBoxProps {
  tonate: Tonate;
}

export const ReceivedTonateBox: FC<ReceivedTonateBoxProps> = ({ tonate }) => {
  const receiveTonate = async () => {
    console.log("receive ton!!");
    // @TODO - call receive ton API
    // await tonate.sendReceiveTon();
  };

  return (
    <div className={styles.receivedTonateBox}>
      <div>
        <span>Tonated By</span>
        <span>@TeamTonate</span>
      </div>
      <hr />
      <div>
        <span>Received TON</span>
        <PrivateChip />
      </div>
      <div>
        <span>{`${tonate?.value ?? 100} TON`}</span>
      </div>
      <button className={styles.receiveButton} onClick={receiveTonate}>
        Receive TON
      </button>
    </div>
  );
};
