import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from "mdbreact";
import './index.css';
import firebaseApp from './firebaseApp';

class Goals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      goalName: '',
      priority: '',
      goals: []
    }
  }
    

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleInput = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.goalName.length) {
      return;
    }
    const newItem = {
      goalName: this.state.goalName,
      priority: this.state.priority,
      projectID: this.props.projectID
    };

    const goalsRef = firebaseApp.database().ref('goals');
    goalsRef.push(newItem);

    this.setState(state => ({
      goalName: '',
      priority: ''
    }));
    this.toggle();
  }

  componentDidMount() {
    const goalsRef = firebaseApp.database().ref('goals');
    goalsRef.on('value', (snapshot) => {
      let goalList = snapshot.val();
      let newState = [];
      for (let goal in goalList) {
        newState.push({
          id: goal,
          priority: goalList[goal].priority,
          goalName: goalList[goal].goalName,
          projectID: goalList[goal].projectID
        });
      }
      this.setState({
        goals: newState
      });
    });
  }

  removeStory(itemId) {
    const itemRef = firebaseApp.database().ref(`/userstories/${itemId}`);
    itemRef.remove();
  }


  render () {
    var goals = [];
    this.state.goals.forEach ((g) => {
      if (this.props.projectID === g.projectID) {
        goals.push(g);
      }
    });
    var goalOrder = 1;
    return (
    <React.Fragment>
      <MDBContainer>
      <MDBCard>
      <MDBCardBody>
      <MDBCardTitle>High Level Goals</MDBCardTitle>
      <MDBCardText>
      {goals.map(goal => (
        <h5 key={goal.id}>{goalOrder}) {goal.goalName}</h5>
		  ))}
      <MDBBtn color="primary" size="sm" onClick={this.toggle}>Add High level goals</MDBBtn>
      </MDBCardText>
      </MDBCardBody>
      </MDBCard>
      </MDBContainer>
      <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
        <MDBModalHeader toggle={this.toggle}>Enter New Goal</MDBModalHeader>
        <MDBModalBody>
          Goal: <MDBInput type="textarea" name="goalName" label="high level goal" onChange={this.handleInput}/>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
          <MDBBtn color="primary" onClick={this.handleSubmit}>Save changes</MDBBtn>
        </MDBModalFooter>
      </MDBModal>
		</React.Fragment>
    );
  }
}

export default Goals;