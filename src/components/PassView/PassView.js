import React, { Component } from "react";

class PassView extends Component {
  handleClick = e => {
    this.props.board.pass();
  };
  render() {
    return (
      <input
        id="pass-btn"
        type="button"
        value="Pass"
        onClick={this.handleClick}
      />
    );
  }
}

export default PassView;
