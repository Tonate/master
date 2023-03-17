import { FC, useState } from "react";
import clsx from "clsx";

import styles from "./Toggle.module.css";

interface ToggleProps {
  leftText: string;
  rightText: string;
  onChangeSelect: (isLeft: boolean) => void;
}

export const Toggle: FC<ToggleProps> = ({
  leftText,
  rightText,
  onChangeSelect,
}) => {
  const [isLeft, setIsLeft] = useState(true);

  const clickToggle = () => {
    setIsLeft(!isLeft);
    onChangeSelect(!isLeft);
  };

  return (
    <div className={styles.toggle} onClick={clickToggle}>
      <div className={clsx(isLeft && styles.selected)}>{leftText}</div>
      <div className={clsx(!isLeft && styles.selected)}>{rightText}</div>
    </div>
  );
};
