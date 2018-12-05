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
      left: this.props.col * GRID_SIZE,
      backgroundColor: this.props.color !== Board.EMPTY ? this.props.color === Board.BLACK ? window._PLAYER_ONE_COLOR : window._PLAYER_TWO_COLOR : undefined
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

class NewGame extends Component {

  handleClick = e => {
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
    console.log("board was updated and component shall render");
  }

  undo=()=>{
    console.log('undo...')
    var {history} = this.state;
    if(history.length <= 1) {
      window.location.reload(false); 
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
          <a href="https://github.com/L1zz13/G0/">Source Code</a>
          <AlertView board={this.state.board} />
          <PassView board={this.state.board} /><br/><br/>
          <NewGame board={this.state.board} onReset={this.onBoardUpdate.bind(this)} /><br/><br/>

          <button onClick={this.undo}>Undo</button><br/><br/>
          <p> Player 1 Color:</p>
          <select name="playerOneColor" onChange={(e)=>{
            console.log(e.target.value)
            window._PLAYER_ONE_COLOR = e.target.value;
          }}><option name="default" value="#5632a8">default</option><option name="black" value="#000000">black</option><option name="red" value="#ff0000">red</option><option name="blue" value="#0000ff">blue</option></select>
          <p>Player 2 Color:</p>
          <select name="playerTwoColor" onChange={(e)=>{
            console.log(e)
            window._PLAYER_TWO_COLOR = e.target.value;

          }}><option name="default" value="#faef5c">default</option><option name="default" value="#ffffff">white</option><option name="pink" value="#ffb6c1">pink</option><option name="yellow" value="#fff000">yellow</option></select>
         
          
        </div>
        
      </div>
    );
  }
}

export default ContainerView;
