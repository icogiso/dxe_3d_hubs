import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ReactionInfo } from "./ReactionInfo";
import { getMicrophonePresences } from "../../utils/microphone-presence";
import { useCan } from "./hooks/useCan";
import { useRoomPermissions } from "./hooks/useRoomPermissions";
import { useRole } from "./hooks/useRole";

export function userFromPresence(sessionId, presence, micPresences, mySessionId, voiceEnabled) {
  const meta = presence.metas[presence.metas.length - 1];
  const micPresence = micPresences.get(sessionId);
  if (micPresence && !voiceEnabled && !meta.permissions.voice_chat) {
    micPresence.muted = true;
  }
  return { id: sessionId, isMe: mySessionId === sessionId, micPresence, ...meta };
}

function usePeopleList(presences, mySessionId, micUpdateFrequency = 500) {
  const [people, setPeople] = useState([]);
  const { voice_chat: voiceChatEnabled } = useRoomPermissions();

  useEffect(() => {
    let timeout;

    function updateMicrophoneState() {
      const micPresences = getMicrophonePresences();

      setPeople(
        Object.entries(presences).map(([id, presence]) => {
          return userFromPresence(id, presence, micPresences, mySessionId, voiceChatEnabled);
        })
      );

      timeout = setTimeout(updateMicrophoneState, micUpdateFrequency);
    }

    updateMicrophoneState();

    return () => {
      clearTimeout(timeout);
    };
  }, [presences, micUpdateFrequency, setPeople, mySessionId, voiceChatEnabled]);

  return people;
}

function PeopleListContainer({ hubChannel, people, onSelectPerson, onClose }) {
  const onMuteAll = useCallback(() => {
    for (const person of people) {
      if (person.presence === "room" && person.permissions && !person.permissions.mute_users) {
        hubChannel.mute(person.id);
      }
    }
  }, [people, hubChannel]);
  const canVoiceChat = useCan("voice_chat");
  const { voice_chat: voiceChatEnabled } = useRoomPermissions();
  const isMod = useRole("owner");

  return (
    <ReactionInfo
      people={people}
    />
  );
}

PeopleListContainer.propTypes = {
  onSelectPerson: PropTypes.func.isRequired,
  hubChannel: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  people: PropTypes.array.isRequired
};

export function ReactionInfoContainer({
  hubChannel,
  presences,
  mySessionId,
  onClose
}) {
  const people = usePeopleList(presences, mySessionId);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const selectedPerson = people.find(person => person.id === selectedPersonId);
  const setSelectedPerson = useCallback(
    person => {
      setSelectedPersonId(person.id);
    },
    [setSelectedPersonId]
  );

  return (
    <PeopleListContainer onSelectPerson={setSelectedPerson} onClose={onClose} hubChannel={hubChannel} people={people} />
  );
}

ReactionInfoContainer.propTypes = {
  displayNameOverride: PropTypes.string,
  store: PropTypes.object.isRequired,
  mediaSearchStore: PropTypes.object.isRequired,
  hubChannel: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  mySessionId: PropTypes.string.isRequired,
  presences: PropTypes.object.isRequired,
  performConditionalSignIn: PropTypes.func.isRequired,
  onCloseDialog: PropTypes.func.isRequired,
  showNonHistoriedDialog: PropTypes.func.isRequired
};
