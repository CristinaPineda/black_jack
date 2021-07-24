import React, { Component } from 'react';
import '../styles/Game.css';

export default class Game extends Component {
  constructor() {
    super();

    this.fetchDeck = this.fetchDeck.bind(this);
    this.shuffleDeck = this.shuffleDeck.bind(this);
    this.fetchCard = this.fetchCard.bind(this);
    this.playerStand = this.playerStand.bind(this);
    this.playerHits = this.playerHits.bind(this);
    this.valueConverter = this.valueConverter.bind(this);

    this.state = {
      deckID: '',
      dealerCards: [],
      dealerPoints: 0,
      playerCards: [],
      playerPoints: 0,
      playerLost: false,
      playerTie: false,
      playerWon: false,
      remainingCards: '',
      shuffled: false,
    };
  }

  componentDidMount() {
    this.fetchDeck();
  }

  async fetchCard() {
    // Função pra comprar uma carta
    const { deckID } = this.state;
    const fetchCard = await fetch(`http://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`);
    const cardJSON = await fetchCard.json();
    return cardJSON;
  }

  valueConverter(card, playerPoints) {
    // Converte valor de carda de figura em valor numérico
    if (card.value === 'KING' || card.value === 'QUEEN' || card.value === 'JACK') {
      return (card.value = 10);
    } else if (card.value === 'ACE') {
      if (playerPoints > 10) {
        return (card.value = 1);
      } else {
        return (card.value = 11);
      }
    }
  }

  async fetchDeck() {
    const { dealerPoints } = this.state;
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

    this.valueConverter(card, dealerPoints);

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

  async playerHits() {
    const { playerPoints, remainingCards } = this.state;
    const cardJSON = await this.fetchCard();
    const [card] = cardJSON.cards;

    this.valueConverter(card, playerPoints);

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

  async playerStand() {
    const { dealerPoints, playerPoints } = this.state;
    if (dealerPoints < playerPoints) {
      console.log('dealer tem menos pontos que o player, devo comprar');
      const cardJSON = await this.fetchCard();
      const [card] = cardJSON.cards;
      this.valueConverter(card, dealerPoints);
      this.setState((prevState) => ({
        dealerCards: [...prevState.dealerCards, card],
        dealerPoints: prevState.dealerPoints + parseInt(card.value),
        remainingCards: cardJSON.remaining,
      }));
      if (dealerPoints === 21) {
        this.setState({
          playerLost: true,
        });
      }
    } else if (dealerPoints === playerPoints) {
      this.setState({
        playerTie: true,
      });
    }
  }

  render() {
    const { playerCards, dealerCards, playerLost, playerWon, playerTie } = this.state;
    return (
      <main className="container">
        <h1>Blackjack!</h1>
        <div className="dealer-card">
          <h4>Dealer:</h4>
          <div>
            {dealerCards.map((card) => (
              <img key={`card ${card.code}`} src={card.image} alt="dealer cards" />
            ))}
          </div>
        </div>
        <div className="player-card">
          <h4>Suas cartas:</h4>
          <div>
            {playerCards.map((card) => (
              <img key={`card ${card.code}`} src={card.image} alt="player cards" />
            ))}
          </div>
          {!playerLost || <div>PERDEU!!</div>}
          {playerWon ? <div>GANHOU!!</div> : null}
          {playerTie ? <div>EMPATE!!</div> : null}
        </div>
        <div className="play-buttons">
          <button onClick={this.playerHits}>HIT (comprar)</button>
          <button onClick={this.playerStand}>STAND (manter)</button>
        </div>
      </main>
    );
  }
}
