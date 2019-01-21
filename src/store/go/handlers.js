import { withHandlers } from "recompose";
import { history } from "../index";

export default withHandlers({
  navigateTo: () => async ({ path }) => {
    history.push(path);
  },
  sendMessage: () => async ({ room, payload }) => {
    const message = JSON.stringify({
      action: "chat:message:sent",
      payload
    });
    await room.broadcast(message);
  },
  updatePlayerProfile: () => async ({ room, payload }) => {
    const message = JSON.stringify({
      action: "lobby:player:profileUpdated",
      payload
    });
    await room.broadcast(message);
  },
  saveDTO: () => async ({ db, room, dto, opponent }) => {
    await db.put({
      _id: "dto:latest",
      ...dto
    });
    const message = JSON.stringify({
      action: "game:dto:saved",
      payload: {
        dto
      }
    });
    await room.sendTo(opponent, message);
    // alert("dto saved.");
  },
  deleteDTO: () => async ({ db, room, dto, opponent }) => {
    await db.del("dto:latest");
    const message = JSON.stringify({
      action: "game:dto:deleted",
      payload: {
        dto
      }
    });
    await room.sendTo(opponent, message);
    // alert("dto deleted.");
  },
  sendGameInvite: ({ gameInvitationAccepted }) => async ({ room, payload }) => {
    const message = JSON.stringify({
      action: "game:invite",
      payload
    });
    room.sendTo(payload.to, message);
  },
  acceptGameInvite: ({ gameInvitationAccepted }) => async ({
    room,
    payload
  }) => {
    const message = JSON.stringify({
      action: "game:invite:accepted",
      payload
    });
    // you are player 0, they are player 1
    // todo: establish colors and initialize game deterministically from invite.
    room.sendTo(payload.players[1], message);
    gameInvitationAccepted(payload);
  }
});
