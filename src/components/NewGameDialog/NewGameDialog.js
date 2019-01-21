import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";


const peerIdToProfileAttribute = (players, peerId, attr) => {
  if (players && players[peerId]) {
    return players[peerId][attr];
  }
  return "";
};

class NewGameDialog extends React.Component {
  state = {
    open: false
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.go.invitation &&
      nextProps.go.invitation.from &&
      !Object.keys(nextProps.go.game).length
    ) {
      this.setState({
        from: nextProps.go.invitation.from,
        open: true
      });
    } else {
      this.setState({
        open: false
      });
    }
  }

  render() {
    const { go, room, acceptGameInvite, navigateTo } = this.props;
    const { from, open } = this.state;
    return (
      <div>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Game Invite"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Invitation from {peerIdToProfileAttribute(go.players, from, 'playerName')}.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ open: false });
              }}
              color="primary"
            >
              Reject
            </Button>
            <Button
              onClick={async () => {
                const nonce = Math.random().toString(16);
                acceptGameInvite({
                  room,
                  payload: {
                    nonce,
                    players: [go.peerInfo.id, go.invitation.from]
                  }
                });

                const newGameDB = await this.props.orbitdb.create(
                  `go.game.${nonce}`,
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
              }}
              color="primary"
              autoFocus
            >
              Accept
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default NewGameDialog;
