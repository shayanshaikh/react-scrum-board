import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from "mdbreact";
import './index.css';
import firebaseApp from './firebaseApp';
import Rows from './Rows';
import Stories from './Stories';

class Sprints extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      sprints: [],
      goals: [],
      selectedGoal: '',
      selectedSprint: ''
    }
  }
    
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      selectedGoal: ''
    });
  }

  selectGoal = (goalName) => {
    this.setState({
      selectedGoal: goalName
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.selectedGoal.length) {
      return;
    }
    const newItem = {
      releaseID: this.props.releaseID,
      projectID: this.props.projectID,
      goal: this.state.selectedGoal
    };

    const sprintsRef = firebaseApp.database().ref('sprints');
    sprintsRef.push(newItem);

    this.toggle();
  }

  componentDidMount() {
    const sprintsRef = firebaseApp.database().ref('sprints');
    sprintsRef.on('value', (snapshot) => {
      let sprintsList = snapshot.val();
      let newState = [];
      for (let sprint in sprintsList) {
        newState.push({
          id: sprint,
          releaseID: sprintsList[sprint].releaseID,
          projectID: sprintsList[sprint].projectID,
          goal: sprintsList[sprint].goal
        });
      }
      this.setState({
        sprints: newState
      });
    });
    const goalsRef = firebaseApp.database().ref('goals');
    goalsRef.on('value', (snapshot) => {
      let goalList = snapshot.val();
      let newState = [];
      for (let goal in goalList) {
        newState.push({
          id: goal,
          goalName: goalList[goal].goalName,
          projectID: goalList[goal].projectID
        });
      }
      this.setState({
        goals: newState
      });
    });
  }

  removeSprint(itemId) {
    const itemRef = firebaseApp.database().ref(`/sprints/${itemId}`);
    itemRef.remove();
  }

  selectSprint = (sprintID) => {
    this.setState({
      selectedSprint: sprintID
    });
  }

  closeSprint = () => {
    this.setState({
      selectedSprint: ''
    });
  }


  render () {
    var sprints = [];
    var takenGoals = [];
    var i = 1;
    this.state.sprints.forEach ((s) => {
      if (this.props.projectID === s.projectID && this.props.releaseID === s.releaseID) {
        const newItem = {
          id: s.id,
          releaseID: s.releaseID,
          projectID: s.projectID,
          goal: s.goal,
          number: i
        };
        if (s.goal.length !== 0) {
          takenGoals.push(s.goal);
        }
        sprints.push(newItem);
        i = i + 1;
      }
    });
    var goals = [];
    this.state.goals.forEach ((g) => {
      var found = takenGoals.find(function(element) { 
        return element === g.goalName; 
      });
      if (this.props.projectID === g.projectID && typeof found === "undefined") {
        goals.push(g);
      }
    });

    return (
      <React.Fragment>
          <h4 className="w-50 text-center"><MDBBtn color="primary" size="sm" id="projectbtn" onClick={this.toggle}>+New Sprint Plan</MDBBtn></h4>
          { sprints.length === 0 ? <h3 className="emptyTitle">Looks like you have no sprint plans try creating a new one.</h3> : null }
          {sprints.map(sprint => ( 
            <React.Fragment key={sprint.id} >     
            <MDBContainer className="w-75">
            <MDBCard className="card">
            <MDBCardBody>
            <MDBCardTitle>Sprint {sprint.number} <MDBBtn className="deleteTask" color="danger" size="sm" onClick={() => { if (window.confirm("Are you sure you want to delete this permantly?")) this.removeSprint(sprint.id)} }>×</MDBBtn></MDBCardTitle>
            <MDBCardText>
              Goal: {sprint.goal} <br/>
              {this.state.selectedSprint === sprint.id ? <MDBBtn color="warning" size="sm" onClick={this.closeSprint}>Close</MDBBtn> : <MDBBtn color="info" size="sm" onClick={() => this.selectSprint(sprint.id)}>Open</MDBBtn> }
            </MDBCardText>
            </MDBCardBody>
            </MDBCard>
            </MDBContainer>
            {this.state.selectedSprint === sprint.id ? <Stories sprintID={this.state.selectedSprint} /> : null}
            </React.Fragment>
          ))}
          <MDBModal isOpen={this.state.modal} toggle={this.toggle} centered>
            <MDBModalHeader toggle={this.toggle}>Create a New Sprint</MDBModalHeader>
            <MDBModalBody>
              Here is where you will pick the goal you want to guide this sprint.
              { goals.length === 0 ? <h5 className="emptyTitle">Looks like you have no goals try adding some goals first.</h5> : null }
              {goals.map(goal => (
                <MDBCard key={goal.id} className="card">
                <MDBCardBody>
                <MDBCardText>{goal.goalName} <br/> { goal.goalName === this.state.selectedGoal ? <MDBBtn color="success" size="sm"><i className="fas fa-check"></i>Selected</MDBBtn> : <MDBBtn color="primary" size="sm" onClick={() => this.selectGoal(goal.goalName) }>Select</MDBBtn> }</MDBCardText>
                </MDBCardBody>
                </MDBCard>
              ))}
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

export default Sprints;
