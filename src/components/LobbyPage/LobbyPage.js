import React, { Component } from "react";
import getIPFS from "../../utils/ipfs-helpers";

import { getOrbitDB } from "../../utils/orbit-helpers";

import Button from "@material-ui/core/Button";

import { NewGameDialog } from "../index";

const Room = require("ipfs-pubsub-room");
class LobbyPage extends Component {
  state = {
    peers: []
  };
  async componentWillMount() {
    console.log(this.props);
    const { selfPeerInfo, gameInvitationRecieved, navigateTo } = this.props;
    const ipfs = await getIPFS();
    const orbitdb = await getOrbitDB();
    const peerInfo = await ipfs.id();
    selfPeerInfo({ peerInfo });
    const room = Room(ipfs, "room-name");
    this.room = room;
    this.orbitdb = orbitdb;

    room.on("peer joined", async peer => {
      console.log("Peer joined the room", peer);
    });

    room.on("peer left", peer => {
      console.log("Peer left...", peer);
    });

    // now started to listen to room
    room.on("subscribed", () => {
      console.log("Now connected!");
    });

    room.on("message", async message => {
      const parsedMessage = JSON.parse(message.data);

      console.log(parsedMessage);

      if (parsedMessage.action === "game:invite") {
        gameInvitationRecieved({
          from: message.from
        });
      }
      if (parsedMessage.action === "game:invite:accepted") {
        // TODO update permissions to restrict players only
        const newGameDB = await orbitdb.create(
          `go.game.${parsedMessage.payload.nonce}`,
          "docstore",
          {
            replicate: true,
            overwrite: true,
            write: ["*"]
          }
        );

        const gameAddress = newGameDB.address.toString();

        navigateTo({
          path: `/game${gameAddress}`
        });
      }
    });

    setInterval(async () => {
      this.setState({
        peers: room.getPeers()
      });
    }, 3 * 1000);
  }
  render() {
    const { peers } = this.state;
    const { sendGameInvite, navigateTo } = this.props;
    return (
      <div className="LobbyPage">
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            navigateTo({ path: "/" });
          }}
        >
          Home
        </Button>

        <h3> Ask for a game with: </h3>
        {peers.map(peerId => {
          return (
            <div key={peerId}>
              <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  const payload = {
                    to: peerId
                  };
                  sendGameInvite({ room: this.room, payload });
                }}
              >
                {peerId}
              </Button>
            </div>
          );
        })}
        <NewGameDialog room={this.room} orbitdb={this.orbitdb} />
      </div>
    );
  }
}

export default LobbyPage;

// const ipfsInfo = await ipfs.id();
// console.log(ipfsInfo.id);
// let orbitdb = await getOrbitDB();

// const db = await orbitdb.create("go.lobby", "docstore", {
//   replicate: true,
//   overwrite: true,
//   write: ["*"]
// });

// await db.put({
//   _id: ipfsInfo.id,
//   name: ipfsInfo.id
// });

// await db.load();
