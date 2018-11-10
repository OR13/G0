import React, { Component } from "react";
import "./App.css";

import Board from "./board";

import ContainerView from "./go";

var board = new Board(19);

class App extends Component {
  render() {
    return (
      <div className="App">

        <ContainerView board={board} />
      </div>
    );
  }
}

export default App;
