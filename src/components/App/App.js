import React, { Component } from "react";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import createStore from "../../store";

import { Route, Switch } from "react-router"; // react-router v4
import { ConnectedRouter } from "connected-react-router";

import "./App.css";

import { GamePage, LandingPage, LobbyPage } from "../index";

const { store, persistor, history } = createStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ConnectedRouter history={history}>
            <Switch>
              <Route exact path="/" render={() => <LandingPage />} />
              <Route exact path="/lobby" render={() => <LobbyPage />} />
              <Route path="/game" render={() => <GamePage />} />
              {/* <Route exact path="/game" render={() => <GamePage />} /> */}
              <Route render={() => <div>Miss</div>} />
            </Switch>
          </ConnectedRouter>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
