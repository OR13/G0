import { handleActions } from "redux-actions";

import {
  selfPeerInfo,
  gameInvitationRecieved,
  gameInvitationAccepted,
  playerProfileUpdated,
  chatMessageReceived
} from "./actions";

const initialState = {
  version: 0,
  players: {},
  invitation: {},
  game: {},
  messages: [] //require('./__fixtures__/messages').default.messages
};

export default handleActions(
  {
    [selfPeerInfo]: (state, { payload }) => ({
      ...state,
      ...payload
    }),
    [chatMessageReceived]: (state, { payload }) => ({
      ...state,
      messages: [...state.messages, payload]
    }),
    [playerProfileUpdated]: (state, { payload }) => ({
      ...state,
      players: {
        ...state.players,
        [payload.peerId]: {
          ...payload
        }
      }
    }),
    [gameInvitationAccepted]: (state, { payload }) => ({
      ...state,
      game: {
        ...payload
      }
    }),
    [gameInvitationRecieved]: (state, { payload }) => ({
      ...state,
      invitation: {
        ...payload
      }
    })
  },
  initialState
);
