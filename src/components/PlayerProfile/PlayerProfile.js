import React, { Component } from "react";

import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

import _ from "lodash";

const moods = [
  {
    value: "😀",
    label: "😀"
  },
  {
    value: "😅",
    label: "😅"
  },
  {
    value: "😇",
    label: "😇"
  },
  {
    value: "🤔",
    label: "🤔"
  },
  {
    value: "😰",
    label: "😰"
  }
];

class PlayerProfile extends Component {
  state = {
    playerName: "",
    playerEmoji: "😀"
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
    if (name === "playerName" || name === "playerEmoji") {
      this.safePlayerProfileUpdate();
    }
  };

  sendProfileToPeers = () => {
    this.props.updatePlayerProfile({
      room: this.props.room,
      payload: {
        peerId: this.props.peerId,
        playerName: this.state.playerName,
        playerEmoji: this.state.playerEmoji
      }
    });
  };

  safePlayerProfileUpdate = _.debounce(async () => {
    this.sendProfileToPeers();
  }, 1 * 1000);

  componentWillMount() {
    const profile = {
      peerId: this.props.peerId,
      playerName: this.props.peerId.substring(2, 6) + "...",
      playerEmoji: "😀"
    };
    this.setState({
      ...profile
    });

    this.safePlayerProfileUpdate();
    
    this.props.room.on("peer joined", async peer => {
      console.log("Peer joined the room", peer);
      this.sendProfileToPeers();
    });
    this.props.room.on("subscribed", () => {
      // console.log("Now connected!");
      this.sendProfileToPeers();
    });
  }

  render() {
    return (
      <div>
        <h3>Your Profile</h3>
        <TextField
          id="standard-select-currency"
          select
          label="Mood"
          value={this.state.playerEmoji}
          onChange={this.handleChange("playerEmoji")}
          margin="normal"
        >
          {moods.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        &nbsp;&nbsp;
        <TextField
          label="Nickname"
          value={this.state.playerName}
          onChange={this.handleChange("playerName")}
          margin="normal"
        />
      </div>
    );
  }
}

export default PlayerProfile;
