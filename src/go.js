import React, { Component } from "react";
import _ from "lodash";
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
      board: this.props.board,
      history: []
    });
  }

  onBoardUpdate() {
    let history = this.state.history;
    history.push(_.cloneDeep(this.state.board));
    this.setState({ board: this.state.board, history: history });
    console.log("board was updated and component shall render")
  }
  
  undo=()=>{
    console.log('undo...')
    var {history} = this.state;
    if(history.length <= 1) {
      console.log("nothing to undo");
      return
    }
    console.log("popping:", history.pop());
    var last = history[history.length-1];
    console.log("set board to", last)
    this.setState({board: last, history: history});
    console.log("board was updated and component shall render")
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
          <a href="https://l1zz13.github.io/G0/">Source Code</a>
          <AlertView board={this.state.board} />
          <PassView board={this.state.board} /><br/><br/>

          <button onClick={this.undo}>UNDOOOOO</button>
        </div>
      </div>
    );
  }
}

export default ContainerView;
