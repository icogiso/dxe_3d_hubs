import React, { useState } from 'react';
import PropTypes from "prop-types";
import { ReactComponent as Waypoint_btn } from "../icons/Waypoint_btn.svg";
import { ReactComponent as CloseIcon } from "../icons/Close.svg";
import styles from "./WaypointList.scss";

const WaypointList = ({ scene }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [baseURL, setBaseURL] = useState('');

  const toggleModal = () => {
    if (!isOpen) {
      const currentURL = window.location.href;
      setBaseURL(currentURL);
    }
    setIsOpen(!isOpen);
  }
  const closeModal = () => {
    setIsOpen(false);
  }

  const handleButtonClick = (waypointComponent) => {
    const waypointSystem = scene.systems["hubs-systems"].waypointSystem;
    
    if (waypointComponent) {
      //moveToWaypoint関数でテレポート処理を実行
      waypointSystem.moveToWaypoint(waypointComponent, false);
      closeModal();
    } else {
      console.warn("ウェイポイント遷移エラー");
    }
  }

  const waypointSystem = scene.systems["hubs-systems"].waypointSystem;
  const waypoints = waypointSystem.ready;

  return (
    <div className={styles.wayPointBtnCnt}>
      <button className={styles.wayPointBtn} onClick={toggleModal}>
        <div className={styles.wayPointBtnIcon}>
          <Waypoint_btn />
        </div>
      </button>

      {isOpen && (
        <div className={styles.wayPointModal}>
          <div className={styles.wayPointModalWrap}>
            <div className={styles.wayPointModalHeader}>
              <CloseIcon className={styles.wayPointModalClose} onClick={closeModal} />
              <h5 className={styles.wayPointModalTitle}>ワープポイント一覧</h5>
            </div>
            <div className={styles.wayPointListSection}>
              <ul className={styles.wayPointList}>
                {waypoints.map((waypointComponent, index) => {
                  const waypointName = waypointComponent.el.object3D.name;
                  return (
                    <li key={index} className={styles.wayPointItem}>
                      <button
                        className={styles.wayPointLink}
                        onClick={() => handleButtonClick(waypointComponent)}
                      >
                        {waypointName}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

WaypointList.propTypes = {
  scene: PropTypes.object.isRequired
};

export default WaypointList;
