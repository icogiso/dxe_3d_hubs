import React from 'react';
import { ReactComponent as Waypoint } from '../icons/Waypoint.svg';
import styles from './CustomTooltip.scss';

const ObjectTooltip = ({ children }) => (
  <div className={styles.objectTooltip}>
    <div className={styles.spaceKeySection}>
      <div className={styles.spaceKeyContainer}>
        <span className={styles.spaceKey}>spaceキー</span>
        <p className={styles.spaceKeyText}>を押すと空間内の</p>
      </div>
      <p className={styles.spaceKeyDescription}>オブジェクトにメニューが表示され、<br />オブジェクトごとに操作ができます。</p>
    </div>
    <div className={styles.waypointSection}>
      <span className={styles.waypointContainer}>
        <Waypoint />
      </span>
      <p className={styles.waypointText}>をクリックすると指定の座席に<br />つくことができます。</p>
    </div>
    {children && <p className={styles.childrenText}>{children}</p>}
  </div>
);

export default ObjectTooltip;
