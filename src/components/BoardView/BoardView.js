import React, { Component } from "react";

import { BoardIntersection } from "../index";

import { GRID_SIZE } from "../../constants";

class BoardView extends Component {
  render() {
    const { board } = this.props;
    var intersections = [];
    for (var i = 0; i < board.size; i++)
      for (var j = 0; j < board.size; j++)
        intersections.push(
          <BoardIntersection
            key={`${i}-${j}`}
            {...{
              board: board,
              color: board.board[i][j],
              row: i,
              col: j,
              onPlay: this.props.onPlay
            }}
          />
        );
    var style = {
      width: board.size * GRID_SIZE,
      height: board.size * GRID_SIZE
    };
    return (
      <div style={style} id="board">
        {intersections}
      </div>
    );
  }
}

export default BoardView;
