import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

const peerIdToProfileAttribute = (players, peerId, attr) => {
  if (players && players[peerId]) {
    return players[peerId][attr];
  }
  return "";
};

class IPFSPubSubChat extends Component {
  state = {
    content: "",
    messages: []
  };
  componentWillMount() {
    const { room, chatMessageReceived } = this.props;
    room.on("message", async message => {
      const parsedMessage = JSON.parse(message.data);
      if (parsedMessage.action === "chat:message:sent") {
        const chatMessage = {
          ...parsedMessage.payload,
          from: message.from
        };
        chatMessageReceived(chatMessage);
      }
    });
  }

  scrollToBottomOfChat = () => {
    setTimeout(() => {
      if (!document.querySelector(".chatContainer")) {
        return;
      }
      document.querySelector(
        ".chatContainer"
      ).scrollTop = document.querySelector(".chatContainer").scrollHeight;
    }, 1 * 1000);
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  sendMessage = () => {
    this.props.sendMessage({
      room: this.props.room,
      payload: {
        content: this.state.content,
        timestamp: Math.round(new Date().getTime() / 1000)
      }
    });
    this.setState({
      content: ""
    });
  };

  render() {
    const { go } = this.props;
    const { messages, players } = go;
    return (
      <div>
        <h3>Chat</h3>
        {!messages.length && <h5>No Messages</h5>}
        <List
          className="chatContainer"
          style={{
            maxHeight: "420px",
            overflowY: "scroll"
          }}
        >
          {messages.map(m => {
            const mood = peerIdToProfileAttribute(
              players,
              m.from,
              "playerEmoji"
            );
            const name = peerIdToProfileAttribute(
              go.players,
              m.from,
              "playerName"
            );
            return (
              <ListItem key={m.timestamp} alignItems="flex-start">
                {mood}
                <ListItemText
                  primary={name}
                  secondary={
                    <React.Fragment>
                      <Typography component="span" color="textPrimary">
                        {m.content}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            );
          })}
          {this.scrollToBottomOfChat()}
        </List>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <TextField
            label="Message"
            fullWidth
            value={this.state.content}
            onChange={this.handleChange("content")}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={this.sendMessage}
          >
            Send
          </Button>
        </div>
      </div>
    );
  }
}

export default IPFSPubSubChat;
