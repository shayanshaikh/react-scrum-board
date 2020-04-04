import React from 'react';
import ReactDOM from 'react-dom';

import { MDBContainer } from "mdbreact";
import './index.css';

import scrum1 from './assets/scrum1.png';
import scrum2 from './assets/scrum2.png';
import scrum3 from './assets/scrum3.png';
import scrum4 from './assets/scrum4.png';
import scrum5 from './assets/scrum5.png';
import scrum6 from './assets/scrum6.png';
import scrum7 from './assets/scrum7.png';
import scrum8 from './assets/scrum8.png';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render () {
    return (
      <MDBContainer>
        <h1 className="heading chalk">Scrum Planning<br/>Made Simple (ßeta...)</h1>
        <h2 className="heading">Please login above to use our beautiful services.</h2>
        <h2 className="scrumheading">Join</h2><img src={scrum1} className="img-fluid" loading="lazy" alt="..." />
        <h2 className="scrumheading">Now</h2><img src={scrum2} className="img-fluid" loading="lazy" alt="..." />
        <h2 className="scrumheading">To</h2><img src={scrum3} className="img-fluid" loading="lazy" alt="..." />
        <h2 className="scrumheading">Get</h2><img src={scrum4} className="img-fluid" loading="lazy" alt="..." />
        <h2 className="scrumheading">Your</h2><img src={scrum5} className="img-fluid" loading="lazy" alt="..." />
        <h2 className="scrumheading">Scrum</h2><img src={scrum6} className="img-fluid" loading="lazy" alt="..." />
        <h2 className="scrumheading">Plan</h2><img src={scrum7} className="img-fluid" loading="lazy" alt="..." />
        <h2 className="scrumheading">Done</h2><img src={scrum8} className="img-fluid" loading="lazy" alt="..." />
      </MDBContainer>
    );
  }
}

export default HomePage;
