import { createAction } from "redux-actions";

export const playerProfileUpdated = createAction(
  "go/PLAYER_PROFILE_UPDATED",
  ({ peerId, playerName, playerEmoji }) => ({
    peerId,
    playerName,
    playerEmoji
  })
);

export const chatMessageReceived = createAction(
  "go/CHAT_MESSAGE_RECEIVED",
  ({ from, content, timestamp }) => ({
    from,
    content,
    timestamp
  })
);

export const selfPeerInfo = createAction(
  "go/SELF_PEER_INFO",
  ({ peerInfo }) => ({
    peerInfo
  })
);

export const gameInvitationRecieved = createAction(
  "go/GAME_INVITATION_RECEIVED",
  ({ from }) => ({
    from
  })
);

export const gameInvitationAccepted = createAction(
  "go/GAME_INVITATION_ACCEPTED",
  ({ nonce, players }) => ({
    nonce,
    players
  })
);
