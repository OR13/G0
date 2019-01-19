import React, { Component } from "react";

class NewGame extends Component {
  handleClick = e => {
    window.location.reload(false);
    this.props.board.reset();
    this.props.onReset();
  };

  render() {
    return (
      <input
        id="newgame-btn"
        type="button"
        value="New Game"
        onClick={this.handleClick}
      />
    );
  }
}

export default NewGame;
