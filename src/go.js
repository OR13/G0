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
      backgroundColor: this.props.color !== Board.EMPTY ? this.props.color === Board.BLACK ? window._PLAYER_ONE_COLOR : window._PLAYER_TWO_COLOR : undefined,
      backgroundImage: this.props.color !== Board.EMPTY ? this.props.color === Board.BLACK ? window._PLAYER_ONE_IMAGE : window._PLAYER_TWO_IMAGE : undefined,

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

class CapturesView extends Component {
  render() {
    var textCaptures = "Captures by Black: " + this.props.board.capturesArrayBlack.reduce((a,b) => a + b, 0);
    return (
    <div id="alerts">&nbsp;{textCaptures}&nbsp;</div>
    );
  }
}

class CapturesView2 extends Component {
  render() {
    var textCaptures2 = "Captures by White: " + this.props.board.capturesArrayWhite.reduce((a,b) => a + b, 0);
    return (
    <div id="alerts">&nbsp;{textCaptures2}&nbsp;</div>
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
    if(this.state.board.is_valid_state(this.state.history)) {
      let history = this.state.history;
      history.push(_.cloneDeep(this.state.board));
      this.setState({ board: this.state.board, history: history });
      console.log("board was updated and component shall render");
    } else {
      console.log("invalid move, reset to prior state")
      console.log(this.state.history.length);
      var last = this.state.history[this.state.history.length-1];
      console.log("set board to", last)
      this.setState({board: last});
      this.state.history.pop();
      console.log(this.state.history.length);
    }
  }

  undo=()=>{
    
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
    this.props.board.capturesArrayBlack.pop();
    this.props.board.capturesArrayWhite.pop();
    this.moveCount--;
    console.log("board was updated and component shall render")

    console.log('undo...', this.state.history, this.state.board)
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
          <CapturesView board={this.state.board} />
          <CapturesView2 board={this.state.board} />
          <PassView board={this.state.board} /><br/><br/>
          <NewGame board={this.state.board} onReset={this.onBoardUpdate.bind(this)} /><br/><br/>
          <button onClick={this.undo}>Undo</button><br/><br/>

          <p>Select Player 1 Color: <br></br>
          <select name="playerOneColor" onChange={(e)=>{
            console.log(e.target.value)
            window._PLAYER_ONE_COLOR = e.target.value;
          }}>
          <option name="default" value="#5632a8">default</option><option name="black" value="#000000">black</option><option name="red" value="#D0112E">red</option><option name="blue" value="#4B98F9">blue</option><option name="orange" value="#FD9D16">orange</option></select></p>
          <p>Select Player 2 Color: <br></br>
          <select name="playerTwoColor" onChange={(e)=>{
            console.log(e)
            window._PLAYER_TWO_COLOR = e.target.value;

          }}>
          <option name="default" value="#fbfbca">default</option><option name="default" value="#ffffff">white</option><option name="pale blue" value="#C1F0FE">pale blue</option><option name="lavender" value="#E4C2FD">lavender</option><option name="green" value="#A1FD98">green</option></select></p>
         
          <p>Select Player 1 Emoji: <br/>
          <select name="playerOneImage" onChange={(e)=>{
            console.log(e.target.value)
            window._PLAYER_ONE_IMAGE = e.target.value;
          }}>
          <option name="default" value="">none</option><option name="1" value="url('http://pages.kwanzoo.com/rs/358-EUI-570/images/pusheen-cat-donuts-black-small-2.png')">donut pusheen</option><option name="2" value="url('http://pages.kwanzoo.com/rs/358-EUI-570/images/pusheen-squid-black-SMALL.png')">squid pusheen</option><option name="3" value="url('http://pages.kwanzoo.com/rs/358-EUI-570/images/happyface-black-small-3.png')">happy face</option></select> </p>
          <p>Select Player 2 Emoji: <br/>
          <select name="playerTwoImage" onChange={(e)=>{
            console.log(e.target.value)
            window._PLAYER_TWO_IMAGE = e.target.value;

          }}>
          <option name="default" value="">none</option><option name="1" value="url('http://pages.kwanzoo.com/rs/358-EUI-570/images/pusheen-cat-cat-SMOL.png')">cat pusheen</option><option name="2" value="url('http://pages.kwanzoo.com/rs/358-EUI-570/images/pusheen-art-SMOL.png')">art pusheen</option><option name="3" value="url('http://pages.kwanzoo.com/rs/358-EUI-570/images/upside-down-happy-SMALL.png')">happy face</option></select></p>
         
          
        </div>
        
      </div>
    );
  }
}

export default ContainerView;
