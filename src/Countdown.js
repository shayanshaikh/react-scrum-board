import React from "react";
import './index.css';
import stand from './assets/standup.gif';
import firebaseApp from './firebaseApp';

class CountDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      days: null,
      hours: null,
      minutes: null,
      seconds: null,
      countDownDate: null,
      countDownDateID: null
    };
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
    return (
      <div className="projectTimer">
        { this.state.countDownDate ?
          <div className="standtimer"><img src={stand} className="standgif3" alt="standup gif"/> {this.state.days}Days {this.state.hours}Hrs {this.state.minutes}Mns {this.state.seconds}Sec </div>
          : null}
      </div>
    )
  }
}

export default CountDown;