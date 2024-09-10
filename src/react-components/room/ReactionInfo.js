import React, { useEffect, useState } from "react";
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

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const someoneHandRaised = people.some(person => person.hand_raised);
    if (someoneHandRaised) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [people])
  
  return (
    <div>
      <div className={classNames(styles.ReactionInfo, 'ui-fade-slide', {
        visible: isVisible,
        hidden: !isVisible,
      })}>
        <div className={styles.ReactionInfoWrap}>
          <div className={styles.ReactionInfoHeader}>
            <HandRaisedIcon />
            <p className={styles.ReactionInfoHeaderTitle}>以下のユーザーが挙手しています</p>
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
