import React, { Component } from 'react';
import './Cartas.css';

export default class Cartas extends Component {
  constructor() {
    super();

    this.state = {
      deckCartas : [],
      cartas: [],
    }

    this.cardes = this.cardes.bind(this);
    this.drawCard = this.drawCard.bind(this);
  }

  async cardes() {
    const fetchDecks = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    const fetchDecksObj = await fetchDecks.json();
    this.setState({
      deckCartas: fetchDecksObj.deck_id
    })
  }

  async drawCard() {
    const { deckCartas } = this.state;
    const fetchDraw = await fetch(`https://deckofcardsapi.com/api/deck/${ deckCartas }/draw/?count=4`)
    const fetchDrawObj = await fetchDraw.json();
    this.setState({ 
      cartas: fetchDrawObj.cards
    })
  }

  render() {
    const { cartas } = this.state;
    return (
      <div>
        <h1>Api de cartas</h1>

        <button className="button" type="button" onClick={this.cardes}>
          New deck
        </button>

        <button className="button" type="button" onClick={this.drawCard}>
        New cards
        </button>
          <div className='deck'>
          { cartas.map( item => (
            <div key={item.code}>
              <p>{ item.code }</p>
              <img alt='carta' src={item.image}/>
            </div>
          ) ) }
          </div>

      </div>
    )
  }
}
