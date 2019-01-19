import React, { Component } from "react";

class CapturesView extends Component {
  render() {
    let capturesArray =
      this.props.color === "black"
        ? this.props.board.capturesArrayBlack
        : this.props.board.capturesArrayWhite;
    var textCaptures =
      `Captures by ${this.props.color}: ` +
      capturesArray.reduce((a, b) => a + b, 0);
    return <div id="alerts">&nbsp;{textCaptures}&nbsp;</div>;
  }
}

export default CapturesView;
