import React from 'react';
import { ReactComponent as MoreIcon } from "../icons/More.svg";
import styles from './CustomTooltip.scss';


const MenuTooltip = ({ children }) => (
  <div className={styles.menuTooltip}>
    <p>もう一度チュートリアルを受けたい場合は</p>
    <div className={styles.menuTooltipFlex}>
      <InlineButton icon={<MoreIcon />} text={"メニュー"} />から
      <p>「チュートリアルを開始」を選択します</p>
    </div>
    {children && <p className={styles.childrenText}>{children}</p>}
  </div>
);

function InlineButton({ icon, text }) {
  return (
    <span className={styles.inlineButton}>
      {icon}
      {text}
    </span>
  );
}

export default MenuTooltip;
