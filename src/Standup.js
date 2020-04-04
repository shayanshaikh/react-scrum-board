import React from "react";
import './index.css';
import stand from './assets/standup.gif';
import { MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBCol, MDBContainer, MDBRow, MDBFooter, MDBBtn } from "mdbreact";
import firebaseApp from './firebaseApp';

class Standup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      days: null,
      hours: null,
      minutes: null,
      seconds: null,
      countDownDate: null,
      countDownDateID: null
    };
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  resetTimer = (itemId) => {
    const itemRef = firebaseApp.database().ref(`/standupdates/${itemId}`);
    itemRef.update({
      "standupdate":new Date().getTime()
    });
  }

  endTimer(itemId) {
    const itemRef = firebaseApp.database().ref(`/standupdates/${itemId}`);
    itemRef.remove();
    this.setState({
      countDownDate: null,
      countDownDateID: null
    });
  }
  
  handleSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      standupdate: new Date().getTime(),
      projectID: this.props.projectID
    };

    const standupsRef = firebaseApp.database().ref('standupdates');
    standupsRef.push(newItem);

    this.toggle();
  }

  componentDidMount() {
    const standupsRef = firebaseApp.database().ref('standupdates');
    standupsRef.on('value', (snapshot) => {
      let standups = snapshot.val();
      for (let standup in standups) {
        if (standups[standup].projectID === this.props.projectID) {
          this.setState({
            countDownDate: standups[standup].standupdate,
            countDownDateID: standup
          });
        }
      }
    });
    this.interval = setInterval(() => {
      var now = new Date().getTime();   
      // Find the distance between now and the count down date
      var distance = now-this.state.countDownDate; 
      // Time calculations for days, hours, minutes and seconds
      var daysN = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hoursN = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutesN = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var secondsN = Math.floor((distance % (1000 * 60)) / 1000);

      this.setState({
        days: daysN,
        hours: hoursN,
        minutes: minutesN,
        seconds: secondsN
      });
    }, 1000);
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  render() {
    if (this.state.countDownDate) {
      var countDownTimer = <div><h6>Time since last stand up meeting: </h6><p className="standtimer"><img src={stand} className="standgif2" />{this.state.days}Days {this.state.hours}Hrs {this.state.minutes}Mns<img src={stand} className="standgif" /></p><MDBBtn color="deep-purple" size="sm" onClick={() => { if (window.confirm("Did you really meet with your entire group? Did everyone really answer the 3 required questions?")) this.resetTimer(this.state.countDownDateID)} }>Reset Stand Up Timer</MDBBtn><MDBBtn color="danger" size="sm" onClick={() => this.endTimer(this.state.countDownDateID)}>Stop Stand Up Timer</MDBBtn></div>;
    } else {
      var countDownTimer = <div><img src={stand} className="standgif" /><MDBBtn color="deep-purple" onClick={this.toggle}>Did you have your first Stand-up meeting?</MDBBtn><img src={stand} className="standgif2" /></div>;
    }
    return (
      <React.Fragment>
      <div className="text-center">
        {countDownTimer}
      </div>
        <MDBModal isOpen={this.state.modal} toggle={this.toggle} centered>
          <MDBModalHeader toggle={this.toggle}>Has your team completed their first stand-up meeting?</MDBModalHeader>
          <MDBModalBody>
            A stand-up meeting should include each member answering these three questions:<br/><br/>
            1) What did you accomplish since the last meeting?<br/><br/>
            2) What are you working on until the next meeting?<br/><br/>
            3) What is getting in your way or keeping you from doing your job?
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={this.toggle}>No</MDBBtn>
            <MDBBtn color="primary" onClick={this.handleSubmit}>Yes</MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </React.Fragment>
    )
  }
}

export default Standup;