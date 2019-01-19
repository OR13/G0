import { createAction } from "redux-actions";

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
