import React, { Component } from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import getIPFS from "../../utils/ipfs-helpers";

import { getOrbitDB } from "../../utils/orbit-helpers";

import Button from "@material-ui/core/Button";

import {
  PageNavigation,
  PlayerProfile,
  NewGameDialog,
  IPFSPubSubChat
} from "../index";

const Room = require("ipfs-pubsub-room");

const peerIdToProfileAttribute = (players, peerId, attr) => {
  if (players && players[peerId]) {
    return players[peerId][attr];
  }
  return peerId;
};

class LobbyPage extends Component {
  state = {
    peers: []
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  async componentWillMount() {
    // console.log(this.props);
    const {
      selfPeerInfo,
      playerProfileUpdated,
      gameInvitationRecieved,
      navigateTo
    } = this.props;
    const ipfs = await getIPFS();
    const orbitdb = await getOrbitDB();
    const peerInfo = await ipfs.id();
    this.peerInfo = peerInfo;

    selfPeerInfo({ peerInfo });
    this.roomName = "go.lobby";
    const room = Room(ipfs, this.roomName);
    this.room = room;
    this.ipfs = ipfs;
    this.orbitdb = orbitdb;

    // room.on("peer left", peer => {
    //   console.log("Peer left...", peer);
    // });

    // now started to listen to room
    // room.on("subscribed", () => {
    //   console.log("Now connected!");
    // });

    room.on("message", async message => {
      const parsedMessage = JSON.parse(message.data);
      // console.log(parsedMessage);
      if (parsedMessage.action === "lobby:player:profileUpdated") {
        playerProfileUpdated({
          ...parsedMessage.payload
        });
      }
      if (parsedMessage.action === "game:invite") {
        gameInvitationRecieved({
          from: message.from,
          ...parsedMessage.payload
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
    }, 5 * 1000);
  }
  render() {
    const { peers } = this.state;
    const { go, sendGameInvite } = this.props;

    const { players } = go;

    const isProfileReady = this.room && this.peerInfo.id;
    const isLobbyReady = this.room && peers.length > 0;

    // console.log("lobby render.");

    return (
      <div className="LobbyPage">
        <PageNavigation>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Paper style={{ padding: "16px" }}>
                {!isProfileReady && <CircularProgress />}
                {isProfileReady && (
                  <PlayerProfile room={this.room} peerId={this.peerInfo.id} />
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper style={{ padding: "16px" }}>
                {!isLobbyReady && <CircularProgress />}
                {isLobbyReady && (
                  <div>
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
                            {peerIdToProfileAttribute(
                              players,
                              peerId,
                              "playerEmoji"
                            )}
                            &nbsp;{" "}
                            {peerIdToProfileAttribute(
                              players,
                              peerId,
                              "playerName"
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: "16px" }}>
                {!isLobbyReady && <CircularProgress />}
                {isLobbyReady && <IPFSPubSubChat room={this.room} />}
              </Paper>
            </Grid>
          </Grid>
          <NewGameDialog room={this.room} orbitdb={this.orbitdb} />
        </PageNavigation>
      </div>
    );
  }
}

export default LobbyPage;
