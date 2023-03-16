import clsx from "clsx";
import { FC, useState } from "react";

import styles from "./Toggle.module.css";

interface ToggleProps {
  leftText: string;
  rightText: string;
}

export const Toggle: FC<ToggleProps> = ({ leftText, rightText }) => {
  const [isLeft, setIsLeft] = useState(true);

  const clickToggle = () => {
    setIsLeft(!isLeft);
  };

  return (
    <div className={styles.toggle} onClick={clickToggle}>
      <div className={clsx(isLeft && styles.selected)}>{leftText}</div>
      <div className={clsx(!isLeft && styles.selected)}>{rightText}</div>
    </div>
  );
};
