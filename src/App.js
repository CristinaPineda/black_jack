import React from 'react';
import './App.css';

class App extends React.Component {
  constructor() {
    super();

    this.fetchDeck = this.fetchDeck.bind(this);
    this.fetchCard = this.fetchCard.bind(this);
    this.shuffleDeck = this.shuffleDeck.bind(this);

    this.state = {
      deckID: '',
      lastDraw: [],
      remainingCards: '',
      shuffled: false,
      playerPoints: 0,
      housePoints: 0,
    };
  }
  componentDidMount() {
    this.fetchDeck();
  }

  async fetchDeck() {
    if (!localStorage.getItem('deck-id')) {
      const gettingDeckID = await fetch('http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=3');
      const gettingDeckJSON = await gettingDeckID.json();
      const deckID = gettingDeckJSON.deck_id;
      localStorage.setItem('deck-id', deckID);
    }
    this.setState({
      deckID: localStorage.getItem('deck-id'),
      playerPoints: 0,
    });
  }

  async fetchCard() {
    const { deckID } = this.state;
    const fetchCard = await fetch(`http://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`);
    const cardJSON = await fetchCard.json();
    const [card] = cardJSON.cards;
    if (card.value === 'KING' || card.value === 'QUEEN' || card.value === 'JACK') {
      card.value = 10;
    } else if (card.value === 'ACE') {
      card.value = 11;
    }
    console.log(card.value);
    this.setState((prevState) => ({
      lastDraw: cardJSON.cards,
      remainingCards: cardJSON.remaining,
      shuffled: false,
      playerPoints: prevState.playerPoints + parseInt(card.value),
    }));
  }

  async shuffleDeck() {
    const { deckID } = this.state;
    const shufflingDeck = await fetch(`http://deckofcardsapi.com/api/deck/${deckID}/shuffle/`);
    console.log(shufflingDeck);
    this.setState({
      shuffled: true,
      remainingCards: shufflingDeck.remaining,
      playerPoints: 0,
    });
  }

  render() {
    const { lastDraw } = this.state;
    return (
      <div className="container">
        <div className="card">
          {lastDraw.map((card) => (
            <img key="current-card" src={card.image} alt="" />
          ))}
        </div>
        <button onClick={this.fetchCard}>Pegue uma carta</button>
        <button onClick={this.shuffleDeck}>Embaralhar Deck</button>
      </div>
    );
  }
}

export default App;
