import { Dispatch, FC, SetStateAction } from "react";
import { Copy, Link } from "./icon";

import styles from "./TonateConfirmModal.module.css";

interface TonateConfirmModalProps {
  tonateUrl: string;
  isOpen: boolean;
  onClickConfirm: Dispatch<SetStateAction<boolean>>;
}

export const TonateConfirmModal: FC<TonateConfirmModalProps> = ({
  tonateUrl,
  isOpen,
  onClickConfirm,
}) => {
  const copyTonateLink = () => {
    navigator.clipboard.writeText(tonateUrl);
  };

  return (
    <div className={styles.tonateConfirmModalWrapper} hidden={!isOpen}>
      <dialog open={isOpen} className={styles.tonateConfirmModal}>
        <div className={styles.modalContent}>
          <div>
            <span>How-to</span>
            <ul>
              <li>1.Choose the Telegram group</li>
              <li>2.Drop the link to your Telegram group</li>
              <li>3.They can pick-up the TONs you dropped</li>
            </ul>
          </div>
          <div className={styles.copyBox}>
            <Link />
            <div>{tonateUrl}</div>
            <div onClick={copyTonateLink}>
              <Copy />
            </div>
          </div>
          <button onClick={(e) => onClickConfirm(false)}>Confirm</button>
        </div>
      </dialog>
    </div>
  );
};
