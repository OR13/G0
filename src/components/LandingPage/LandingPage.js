import React, { Component } from "react";
import Button from "@material-ui/core/Button";

class LandingPage extends Component {
  render() {
    return (
      <div className="LandingPage">
        <Button variant="contained" color="primary" onClick={async () => {}}>
          New Game
        </Button>
      </div>
    );
  }
}

export default LandingPage;
