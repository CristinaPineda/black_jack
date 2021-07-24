import React, { Component } from 'react';
import '../styles/Game.css';

export default class Game extends Component {
  constructor() {
    super();

    this.fetchDeck = this.fetchDeck.bind(this);
    this.shuffleDeck = this.shuffleDeck.bind(this);
    this.fetchCard = this.fetchCard.bind(this);
    this.playerStand = this.playerStand.bind(this);

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

  async fetchDeck() {
    // Se não tiver ID de deck salvo no localStorage ele vai requisitar um na API e colocar no localStorage
    if (!localStorage.getItem('deck-id')) {
      const gettingDeckID = await fetch('http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=3');
      const gettingDeckJSON = await gettingDeckID.json();
      const deckID = gettingDeckJSON.deck_id;
      localStorage.setItem('deck-id', deckID);
    }
    // Vai pegar o ID que está salvo em localStorage e já vai comprar uma carta para o DEALER
    const deckID = localStorage.getItem('deck-id');
    const fetchDealerCard = await fetch(`http://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`);
    const cardJSON = await fetchDealerCard.json();
    const [card] = cardJSON.cards;

    // Ao comprar a carda, se o valor dela for alguma carta de figura, vai transformar o valor em 10 ou 11 
    if (card.value === 'KING' || card.value === 'QUEEN' || card.value === 'JACK') {
      card.value = 10;
    } else if (cardJSON.cards.value === 'ACE') {
      card.value = 11;
    }

    // Vai salvar informações no state
    this.setState((prevState) => ({
      deckID,
      dealerCards: cardJSON.cards,
      dealerPoints: prevState.dealerPoints + parseInt(card.value),
      playerPoints: 0,
      remainingCards: cardJSON.remaining,
      shuffled: false,
    }));
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

  async fetchCard() {
    // Invocada onClick, vai fazer o fetch de uma carta para o jogador
    const { deckID, playerPoints, remainingCards } = this.state;
    const fetchCard = await fetch(`http://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`);
    const cardJSON = await fetchCard.json();
    const [card] = cardJSON.cards;

    // Mesma transformação de valores, com a condicional de que se o jogador já tiver mais de 10 pontos, irá transformar o valor do Ás
    if (card.value === 'KING' || card.value === 'QUEEN' || card.value === 'JACK') {
      card.value = 10;
    } else if (card.value === 'ACE') {
      if (playerPoints > 10) {
        card.value = 1;
      } else {
        card.value = 11;
      }
    }

    // Caso o jogador tenha mais de 10 pontos e o valor da próxima carta comprada for >= 10 irá colocar um "PERDEU!!" na tela linha 129
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
    // Caso o atual deck chegue a 14 cartas, irá embaralhar automaticamente pra evitar erro no feth da API
    if (remainingCards < 15) {
      this.shuffleDeck();
    }
  }
  playerStand() {}

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
          <button onClick={this.playerStand}>STAND (manter)</button>
        </div>
      </main>
    );
  }
}
