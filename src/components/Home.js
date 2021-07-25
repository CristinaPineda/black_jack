import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import '../styles/Home.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import firstCarouselImg from '../img/dealer_blackjack.jpg';
import secondCarouselImg from '../img/table_blackjack.jpg';
import thirdCarouselImg from '../img/winner_blackjack.jpg';
import fourthCarouselImg from '../img/players_blackjack.jpg';
import fifthCarouselImg from '../img/deck_blackjack.jpg';


export default class Home extends Component {
  render() {
    return (
      <div>
        <header className="header-home">
          <div className="div-header">
            <Link to="/about" className="btn-about">
              About
            </Link>
          </div>
        </header>
        <section className="section-carousel">
          <Carousel autoPlay="true" width='600px' >
            <div>
              <img src={firstCarouselImg} alt="dealer-blackjack" />
            </div>
            <div>
              <img src={secondCarouselImg} alt="table-blackjack" />
            </div>
            <div>
              <img src={thirdCarouselImg} alt="winner-blackjack"/>
            </div>
            <div>
              <img src={fourthCarouselImg} alt="players-blackjack" />
            </div>
            <div>
              <img src={fifthCarouselImg} alt="deck-blackjack"/>
            </div>
          </Carousel>
        </section>
        <section className="section-play">
          <div className="div-section-play">
            <Link to="/game" className="btn-play">
              PLAY
            </Link>
          </div>
        </section>
      </div>
    );
  }
}
