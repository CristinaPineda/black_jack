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
      dealerCards: [],
      dealerPoints: 0,
      lastDraw: [],
      playerCards: [],
      playerPoints: 0,
      playerLost: false,
      remainingCards: '',
      shuffled: false,
    };
  }
  componentDidMount() {
    this.fetchDeck();
  }
  async shuffleDeck() {
    const { deckID } = this.state;
    const shufflingDeck = await fetch(`http://deckofcardsapi.com/api/deck/${deckID}/shuffle/`);

    this.setState({
      playerPoints: 0,
      remainingCards: shufflingDeck.remaining,
      shuffled: true,
    });
  }

  async fetchDeck() {
    if (!localStorage.getItem('deck-id')) {
      const gettingDeckID = await fetch('http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=3');
      const gettingDeckJSON = await gettingDeckID.json();
      const deckID = gettingDeckJSON.deck_id;
      localStorage.setItem('deck-id', deckID);
    }

    const deckID = localStorage.getItem('deck-id');
    const fetchDealerCard = await fetch(`http://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`);
    const cardJSON = await fetchDealerCard.json();
    const [card] = cardJSON.cards;

    if (card.value === 'KING' || card.value === 'QUEEN' || card.value === 'JACK') {
      card.value = 10;
    } else if (cardJSON.cards.value === 'ACE') {
      card.value = 11;
    }

    this.setState((prevState) => ({
      deckID: deckID,
      dealerCards: cardJSON.cards,
      dealerPoints: prevState.dealerPoints + parseInt(card.value),
      lastDraw: cardJSON.cards,
      playerPoints: 0,
      remainingCards: cardJSON.remaining,
      shuffled: false,
    }));
  }

  async fetchCard() {
    const { deckID, playerPoints, remainingCards } = this.state;
    const fetchCard = await fetch(`http://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`);
    const cardJSON = await fetchCard.json();
    const [card] = cardJSON.cards;

    if (card.value === 'KING' || card.value === 'QUEEN' || card.value === 'JACK') {
      card.value = 10;
    } else if (card.value === 'ACE') {
      if (playerPoints > 11) {
        card.value = 1;
      } else {
        card.value = 11;
      }
    }

    this.setState((prevState) => ({
      playerCards: [...prevState.playerCards, card],
      playerPoints: prevState.playerPoints + parseInt(card.value),
      remainingCards: cardJSON.remaining,
      shuffled: false,
    }));

    if (remainingCards < 10) {
      this.shuffleDeck();
    }
  }

  render() {
    const { playerCards, dealerCards, playerLost } = this.state;
    return (
      <main className="container">
        <h1>Blackjack!</h1>
        <div className="dealer-card">
          <h4>Dealer:</h4>
          {dealerCards.map((card) => (
            <img key={`card ${card.code}`} src={card.image} alt="dealer cards" />
          ))}
        </div>
        <div className="player-card">
          <h4>Suas cartas:</h4>
          <div>
            {playerCards.map((card) => (
              <img key={`card ${card.code}`} src={card.image} alt="player cards" />
            ))}
          </div>
          {playerLost ? <div>PERDEU!!</div> : null}
        </div>
        <div className="play-buttons">
          <button onClick={this.fetchCard}>Pegue uma carta</button>
          <button onClick={this.shuffleDeck}>Embaralhar Deck</button>
        </div>
      </main>
    );
  }
}

export default App;
