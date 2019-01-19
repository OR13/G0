import React, { Component } from "react";

import Board from "../../utils/board";

import { GRID_SIZE } from "../../constants";

class BoardIntersection extends Component {
  handleClick = () => {
    if (this.props.board.play(this.props.row, this.props.col))
      this.props.onPlay(this.props.board);
  };
  render() {
    var style = {
      top: this.props.row * GRID_SIZE,
      left: this.props.col * GRID_SIZE,
      backgroundColor:
        this.props.color !== Board.EMPTY
          ? this.props.color === Board.BLACK
            ? window._PLAYER_ONE_COLOR
            : window._PLAYER_TWO_COLOR
          : undefined,
      backgroundImage:
        this.props.color !== Board.EMPTY
          ? this.props.color === Board.BLACK
            ? window._PLAYER_ONE_IMAGE
            : window._PLAYER_TWO_IMAGE
          : undefined
    };

    var classes = "intersection";
    if (this.props.color !== Board.EMPTY)
      classes += this.props.color === Board.BLACK ? " black" : " white";

    return <div onClick={this.handleClick} className={classes} style={style} />;
  }
}

export default BoardIntersection;
