import { handleActions } from "redux-actions";

import {
  selfPeerInfo,
  gameInvitationRecieved,
  gameInvitationAccepted
} from "./actions";

const initialState = {
  version: 0
};

export default handleActions(
  {
    [selfPeerInfo]: (state, { payload }) => ({
      ...state,
      ...payload
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
