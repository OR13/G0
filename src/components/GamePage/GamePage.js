import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";

import { getOrbitDB } from "../../utils/orbit-helpers";

import { PageNavigation, PlayerProfile, BoardView } from "../index";

import Board from "../../utils/board";

const Room = require("ipfs-pubsub-room");

const BOARD_SIZE = 5;

const playerColorStringToInt = color => {
  return color === "black" ? 1 : 2;
};

const peerIdToProfileAttribute = (players, peerId, attr) => {
  if (players && players[peerId]) {
    return players[peerId][attr];
  }
  return "";
};

class GamePage extends Component {
  state = {
    ready: false
  };
  async componentWillMount() {
    const { router, selfPeerInfo, playerProfileUpdated } = this.props;
    const { pathname } = router.location;
    const orbitDBAddress = pathname.replace("/game", "");
    const roomName = orbitDBAddress.split("/")[3];
    const orbitdb = await getOrbitDB();
    const peerInfo = await orbitdb._ipfs.id();
    selfPeerInfo({ peerInfo });
    const room = Room(orbitdb._ipfs, roomName);
    this.orbitdb = orbitdb;
    this.room = room;
    this.peerId = peerInfo.id;
    this.db = await orbitdb.open(orbitDBAddress);
    await this.db.load();
    const dto = await this.db.get("dto:latest")[0];
    // console.log("loaded dto: ", dto);
    if (dto === undefined) {
      this.board = new Board({ size: BOARD_SIZE });
      const dto = this.board.getDataTransferObject();
      await this.db.put({
        _id: "dto:latest",
        name: "dto:latest",
        ...dto
      });
    } else {
      this.board = new Board(dto);
      // console.log("though it was loaded, it does not render...", this.board);
    }

    room.on("peer joined", async peer => {
      // console.log("Peer joined the room", peer);
    });

    room.on("peer left", peer => {
      // console.log("Peer left...", peer);
    });

    // now started to listen to room
    room.on("subscribed", () => {
      // console.log("Now connected!");
    });

    room.on("message", async message => {
      const { action, payload } = JSON.parse(message.data);
      console.log("message...", message, action, payload);

      if (action === "lobby:player:profileUpdated") {
        playerProfileUpdated({
          ...payload
        });
      }

      if (action === "game:dto:saved") {
        this.board = new Board(payload.dto);
        this.setState({
          board: this.board
        });
      }
      if (action === "game:dto:deleted") {
        this.board = new Board(payload.dto);
        this.setState({
          board: this.board
        });
      }
    });

    const pollTillPresent = setInterval(async () => {
      const [opponent] = room.getPeers();

      if (opponent) {
        const players = [peerInfo.id, opponent].sort();
        this.setState({
          ready: true,
          opponent,
          you: peerInfo.id,
          colors: {
            [players[0]]: "white",
            [players[1]]: "black"
          }
        });
        clearInterval(pollTillPresent);
      }
    }, 1 * 1000);
  }
  render() {
    const { go, saveDTO, deleteDTO } = this.props;
    const { ready, colors, you, opponent } = this.state;

    if (!ready) {
      return <CircularProgress />;
    }

    return (
      <div className="GamePage">
        <PageNavigation>
          <Paper style={{ padding: "16px", marginBottom: "16px" }}>
            <PlayerProfile room={this.room} peerId={this.peerId} />
          </Paper>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              saveDTO({
                room: this.room,
                db: this.db,
                dto: this.board.getDataTransferObject(),
                opponent
              });
            }}
          >
            Save Game
          </Button>
          &nbsp;
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              this.board = new Board({ size: BOARD_SIZE });
              const dto = this.board.getDataTransferObject();
              await this.db.put({
                _id: "dto:latest",
                name: "dto:latest",
                ...dto
              });
              this.setState({
                board: this.board
              });

              deleteDTO({
                room: this.room,
                db: this.db,
                dto,
                opponent
              });
            }}
          >
            Reset Game
          </Button>
          <h3>
            You are {colors[you]},{" "}
            {peerIdToProfileAttribute(go.players, opponent, "playerName")} is{" "}
            {colors[opponent]}
          </h3>
          <h3>
            It is {" "}
            {this.board.current_color === playerColorStringToInt(colors[you])
              ? "your turn"
              : `${peerIdToProfileAttribute(go.players, opponent, "playerName")}'s turn`}
          </h3>
          <BoardView
            currentPlayer={playerColorStringToInt(colors[you])}
            board={this.board}
            onPlay={board => {
              this.board = board;
              // really any state update will cause a re-render after assignment..
              this.setState({
                board
              });
              saveDTO({
                room: this.room,
                db: this.db,
                dto: this.board.getDataTransferObject(),
                opponent
              });
            }}
          />
        </PageNavigation>
      </div>
    );
  }
}

export default GamePage;
