import { useTonConnectUI } from "@tonconnect/ui-react";
import { FC, useEffect, useRef } from "react";

import styles from "./LoginBox.module.css";

const buttonRootId = "ton-connect-button";

export const LoginBox: FC = () => {
  const [_, setOptions] = useTonConnectUI();

  useEffect(() => {
    setOptions({ buttonRootId });
  }, []);

  return (
    <div className={styles.loginBox}>
      <div>
        <span>Hello!</span>
        <span>TONate Login</span>
        <div id={buttonRootId} className={styles.connectWalletButton}></div>
      </div>
      <div className={styles.wavingHandImage}></div>
    </div>
  );
};
