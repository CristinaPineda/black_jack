import React, { Component } from 'react';
import Home from './components/Home';
import Game from './components/Game';
import About from './components/About';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={ Home } />
          <Route exact path='/game' component={ Game } />
          <Route exact path='/about' component={ About } />
        </Switch>
      </BrowserRouter>
    )
  }
}
