import React, { Component } from "react";

import Board from "./board";

var GRID_SIZE = 40;

class BoardIntersection extends Component {
  handleClick = () => {
    if (this.props.board.play(this.props.row, this.props.col))
      this.props.onPlay();
  };
  render() {
    var style = {
      top: this.props.row * GRID_SIZE,
      left: this.props.col * GRID_SIZE
    };

    var classes = "intersection";
    if (this.props.color !== Board.EMPTY)
      classes += this.props.color === Board.BLACK ? " black" : " white";

    return <div onClick={this.handleClick} className={classes} style={style} />;
  }
}

class BoardView extends Component {
  render() {
    var intersections = [];
    for (var i = 0; i < this.props.board.size; i++)
      for (var j = 0; j < this.props.board.size; j++)
        intersections.push(
          <BoardIntersection
            key={`${i}-${j}`}
            {...{
              board: this.props.board,
              color: this.props.board.board[i][j],
              row: i,
              col: j,
              onPlay: this.props.onPlay
            }}
          />
        );
    var style = {
      width: this.props.board.size * GRID_SIZE,
      height: this.props.board.size * GRID_SIZE
    };
    return (
      <div style={style} id="board">
        {intersections}
      </div>
    );
  }
}

class AlertView extends Component {
  render() {
    var text = "";
    if (this.props.board.in_atari) text = "ATARI";
    else if (this.props.board.attempted_suicide) text = "INVALID MOVE";

    return <div id="alerts">{text}</div>;
  }
}

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

class UndoButton extends Component {
  handleClick = e => {
    this.props.board.undo();
    this.props.doUpdate();
  };
  render() {
    return (
      <input
        id="undo-btn"
        type="button"
        value="Undo"
        onClick={this.handleClick}
      />
    );
  }
}

class ContainerView extends Component {
  componentWillMount() {
    this.setState({
      board: this.props.board
    });
  }

  onBoardUpdate() {
    this.setState({ board: this.props.board });
  }
  
  undo=()=>{
    console.log('undo...')
    this.state.board.undo();
    this.onBoardUpdate();
  }

  render() {
    return (
      <div className="ContainerView">
        <div className="ContainerViewBoard">
          <BoardView
            board={this.state.board}
            onPlay={this.onBoardUpdate.bind(this)}
          />
        </div>

        <div className="ContainerViewSidebar">
          <a href="https://github.com/OR13/G0">Source Code</a>
          <AlertView board={this.state.board} />
          <PassView board={this.state.board} /><br/><br/>

          <button onClick={this.undo}>UNDOOOOO</button>
          <UndoButton board={this.state.board} doUpdate={this.onBoardUpdate.bind(this)} />
        </div>
      </div>
    );
  }
}

export default ContainerView;
