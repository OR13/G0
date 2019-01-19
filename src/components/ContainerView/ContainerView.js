import React, { Component } from "react";
import _ from "lodash";

import { BoardView, PassView, NewGame, CapturesView } from "../index";

class ContainerView extends Component {

  componentWillMount() {
    console.log('container view mount....',)
    this.setState({
      board: this.props.board,
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log('container view receive props....',)
    this.setState({
      board: nextProps.board
    });
  }

  onBoardUpdate() {
    // if (this.state.board.is_valid_state(this.state.history)) {
    //   let history = this.state.history;
    //   history.push(_.cloneDeep(this.state.board));
    //   this.setState({ board: this.state.board, history: history });
    //   console.log("board was updated and component shall render");
    // } else {
    //   console.log("invalid move, reset to prior state");
    //   console.log(this.state.history.length);
    //   var last = this.state.history[this.state.history.length - 1];
    //   console.log("set board to", last);
    //   this.setState({ board: last });
    //   this.state.history.pop();
    //   console.log(this.state.history.length);
    // }
  }

  undo = () => {
    // var { history } = this.state;
    // if (history.length <= 1) {
    //   window.location.reload(false);
    //   console.log("nothing to undo");
    //   return;
    // }
    // console.log("popping:", history.pop());
    // var last = history[history.length - 1];
    // console.log("set board to", last);
    // this.setState({ board: last, history: history });
    // this.props.board.capturesArrayBlack.pop();
    // this.props.board.capturesArrayWhite.pop();
    // this.moveCount--;
    // console.log("board was updated and component shall render");

    // console.log("undo...", this.state.history, this.state.board);
  };

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
          <CapturesView board={this.state.board} color={"black"} />
          <CapturesView board={this.state.board} color={"white"} />
          <PassView board={this.state.board} />
          <br />
          <br />
          <NewGame
            board={this.state.board}
            onReset={this.onBoardUpdate.bind(this)}
          />
          <br />
          <br />
          <button onClick={this.undo}>Undo</button>
          <br />
          <br />

          <p>
            Select Player 1 Color: <br />
            <select
              name="playerOneColor"
              onChange={e => {
                console.log(e.target.value);
                window._PLAYER_ONE_COLOR = e.target.value;
              }}
            >
              <option name="default" value="#5632a8">
                default
              </option>
              <option name="black" value="#000000">
                black
              </option>
              <option name="red" value="#D0112E">
                red
              </option>
              <option name="blue" value="#4B98F9">
                blue
              </option>
              <option name="orange" value="#FD9D16">
                orange
              </option>
            </select>
          </p>
          <p>
            Select Player 2 Color: <br />
            <select
              name="playerTwoColor"
              onChange={e => {
                console.log(e);
                window._PLAYER_TWO_COLOR = e.target.value;
              }}
            >
              <option name="default" value="#fbfbca">
                default
              </option>
              <option name="default" value="#ffffff">
                white
              </option>
              <option name="pale blue" value="#C1F0FE">
                pale blue
              </option>
              <option name="lavender" value="#E4C2FD">
                lavender
              </option>
              <option name="green" value="#A1FD98">
                green
              </option>
            </select>
          </p>

          <p>
            Select Player 1 Emoji: <br />
            <select
              name="playerOneImage"
              onChange={e => {
                console.log(e.target.value);
                window._PLAYER_ONE_IMAGE = e.target.value;
              }}
            >
              <option name="default" value="">
                none
              </option>
              <option
                name="1"
                value="url('http://pages.kwanzoo.com/rs/358-EUI-570/images/pusheen-cat-donuts-black-small-2.png')"
              >
                donut pusheen
              </option>
              <option
                name="2"
                value="url('http://pages.kwanzoo.com/rs/358-EUI-570/images/pusheen-squid-black-SMALL.png')"
              >
                squid pusheen
              </option>
              <option
                name="3"
                value="url('http://pages.kwanzoo.com/rs/358-EUI-570/images/happyface-black-small-3.png')"
              >
                happy face
              </option>
            </select>{" "}
          </p>
          <p>
            Select Player 2 Emoji: <br />
            <select
              name="playerTwoImage"
              onChange={e => {
                console.log(e.target.value);
                window._PLAYER_TWO_IMAGE = e.target.value;
              }}
            >
              <option name="default" value="">
                none
              </option>
              <option
                name="1"
                value="url('http://pages.kwanzoo.com/rs/358-EUI-570/images/pusheen-cat-cat-SMOL.png')"
              >
                cat pusheen
              </option>
              <option
                name="2"
                value="url('http://pages.kwanzoo.com/rs/358-EUI-570/images/pusheen-art-SMOL.png')"
              >
                art pusheen
              </option>
              <option
                name="3"
                value="url('http://pages.kwanzoo.com/rs/358-EUI-570/images/upside-down-happy-SMALL.png')"
              >
                happy face
              </option>
            </select>
          </p>
        </div>
      </div>
    );
  }
}

export default ContainerView;
