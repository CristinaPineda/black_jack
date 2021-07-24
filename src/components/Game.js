import React, { Component } from 'react';
import '../styles/Game.css';

export default class Game extends Component {
  constructor() {
    super();

    this.fetchDeck = this.fetchDeck.bind(this);
    this.fetchCard = this.fetchCard.bind(this);
    this.shuffleDeck = this.shuffleDeck.bind(this);

    this.state = {
      deckID: '',
      dealerCards: [],
      dealerPoints: 0,
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
      deckID,
      dealerCards: cardJSON.cards,
      dealerPoints: prevState.dealerPoints + parseInt(card.value),
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

    if ((playerPoints > 10 && card.value >= 10) || (playerPoints > 15 && card.value >= 6)) {
      this.setState((prevState) => ({
        playerCards: [...prevState.playerCards, card],
        playerLost: true,
      }));
    } else {
      this.setState((prevState) => ({
        playerCards: [...prevState.playerCards, card],
        playerPoints: prevState.playerPoints + parseInt(card.value),
        remainingCards: cardJSON.remaining,
        shuffled: false,
      }));
    }

    if (remainingCards < 15) {
      this.shuffleDeck();
    }
  }
  playerStand() {
    
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
          {!playerLost || <div>PERDEU!!</div>}
        </div>
        <div className="play-buttons">
          <button onClick={this.fetchCard}>HIT (comprar)</button>
          {/* <button onClick={}>STAND (manter)</button> */}
        </div>
      </main>
    );
  }
}