import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ReactComponent as HandRaisedIcon } from "../icons/HandRaised.svg";
import { FormattedMessage, defineMessage, useIntl } from "react-intl";
import classNames from "classnames";
import styles from "./ReactionInfo.scss";

function getPersonName(person, intl) {
  const you = intl.formatMessage({
    id: "people-sidebar.person-name.you",
    defaultMessage: "You"
  });
  const suffix = person.isMe ? `(${you})` : person.profile?.pronouns ? `(${person.profile.pronouns})` : "";

  return `${person.profile.displayName} ${suffix}`;
}

export function ReactionInfo({
  people
}) {
  const intl = useIntl();
  const me = people.find(person => !!person.isMe);
  const filteredPeople = people
    .filter(person => !person.isMe)
    .sort(a => {
      return a.hand_raised ? -1 : 1;
    });
  me && filteredPeople.unshift(me);
  const store = window.APP.store;

  const [isVisible, setIsVisible] = useState(false); //UIの表示・非表示
  const [raisedHandCount, setRaisedHandCount] = useState(0); //挙手している人数
  const [raisedHandTimer, setRaisedHandTimer] = useState(0); //UIを表示する残り秒数
  const prevRaisedCountRef = useRef(raisedHandCount);// ±15秒の値を管理

  //空間内で挙手している人数を監視
  useEffect(() => {
    const someoneHandRaised = people.some(person => person.hand_raised);//誰か1人でも挙手していればtrue(使えそうなので一応残す)
    const raisedCount = people.filter(person => person.hand_raised).length;
    setRaisedHandCount(raisedCount);
  }, [people])

  //空間内で挙手したら+15秒,手を下げたら-15秒
  useEffect(() => {
    if (prevRaisedCountRef.current !== raisedHandCount) {
      if (raisedHandCount > prevRaisedCountRef.current) {
        setRaisedHandTimer(prevTimer => prevTimer + 15);
        setIsVisible(true);
      } else if (prevRaisedCountRef.current > raisedHandCount) {
        setRaisedHandTimer(prevTimer => Math.max(prevTimer - 15, 0));
      }
      prevRaisedCountRef.current = raisedHandCount;
    }
  
    if (raisedHandCount === 0) {
      setIsVisible(false);
      setRaisedHandTimer(0);
    }
  }, [raisedHandCount]);

  //1秒ごとに-1する。0でUI非表示
  useEffect(() => {
    if (raisedHandTimer > 0) {
      const interval = setInterval(() => {
        setRaisedHandTimer(prevTimer => prevTimer - 1);
      }, 1000);  
      return () => clearInterval(interval);
    } else {
      setIsVisible(false);
    }
  }, [raisedHandTimer]);
  
  return (
    <div>
      <div className={classNames(styles.ReactionInfo, 'ui-fade-slide', {
        visible: isVisible,
        hidden: !isVisible,
      })}>
        <div className={styles.ReactionInfoWrap}>
          <div className={styles.ReactionInfoHeader}>
            <HandRaisedIcon />
            <p className={styles.ReactionInfoHeaderTitle}>ユーザーが挙手しています({raisedHandCount})</p>
          </div>
          <ul className={styles.ReactionInfoList}>
            {!!people.length && 
              filteredPeople.map(person => {
                return person.hand_raised ? (
                  <div
                    key={person.id}
                    className={classNames(styles.ReactionInfoListWrap, {
                      'text-fade-slide': person.hand_raised,
                      'text-hidden': !person.hand_raised,
                  })} >
                    <li className={styles.ReactionInfoItem}>
                      <p className={styles.ReactionInfoItemText}>・{getPersonName(person, intl)}</p>
                    </li>
                  </div>
                ) : null;
              })
            }
          </ul>
        </div>
      </div>
    </div>
  );
}

ReactionInfo.propTypes = {
  people: PropTypes.array,
};

ReactionInfo.defaultProps = {
  people: [],
  onSelectPerson: () => {},
};
