import { Dispatch, FC, SetStateAction } from "react";

import styles from "./AlertModal.module.css";

interface AlertModalProps {
  isOpen: boolean;
  onClickConfirm: Dispatch<SetStateAction<boolean>>;
}

export const AlertModal: FC<AlertModalProps> = ({ isOpen, onClickConfirm }) => {
  return (
    <div className={styles.alertModalWrapper} hidden={!isOpen}>
      <dialog open={isOpen} className={styles.alertModal}>
        <div className={styles.modalContent}>
          <span>Connect Wallet</span>
          <span>Connect it and get the ton!</span>
          <button onClick={(e) => onClickConfirm(false)}>OK</button>
        </div>
      </dialog>
    </div>
  );
};
