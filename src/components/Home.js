import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel'
import '../styles/Home.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default class Home extends Component {
  render() {
    return (
      <div>
        <header className='header-home'>
        <div className='div-header'>
          <Link to='/about' className='btn-about'>About</Link>
        </div>
        </header>
        <section className='section-carousel'>
          <Carousel autoPlay='true'>
            <div>
              <p>1</p>
            </div>
            <div>
              <p>2</p>
            </div>
            <div>
              <p>3</p>
            </div>
            <div>
              <p>4</p>
            </div>
            <div>
              <p>5</p>
            </div>
          </Carousel>
        </section>
        <section className='section-play'>
          <div className='div-section-play'>
            <Link to='/game' className='btn-play'>PLAY</Link>
          </div>
        </section>
      </div>
    )
  }
}
