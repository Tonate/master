import { useTonConnectUI } from "@tonconnect/ui-react";
import { FC, useEffect } from "react";

import styles from "./LoginBox.module.css";

const BUTTON_ROOT_ID = "ton-connect-button";

export const LoginBox: FC = () => {
  const [_, setOptions] = useTonConnectUI();

  useEffect(() => {
    setOptions({ buttonRootId: BUTTON_ROOT_ID });
  }, []);

  return (
    <div className={styles.loginBox}>
      <div>
        <span>Hello!</span>
        <span>TONate Login</span>
        <div id={BUTTON_ROOT_ID} className={styles.connectWalletButton}></div>
      </div>
      <div className={styles.wavingHandImage}></div>
    </div>
  );
};
