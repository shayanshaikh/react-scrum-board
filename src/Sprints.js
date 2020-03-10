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
      dueDate: '',
      selectedSprint: '',
      edit_modal: false,
      edit_id: ''
    }
  }
    
  edit_toggle = () => {
    this.setState({
      edit_modal: !this.state.edit_modal,
      selectedGoal: '',
      dueDate: ''
    });
  }

  handleEdit = (itemId) => {
    if (!this.state.selectedGoal.length || !this.state.dueDate.length) {
      return;
    }

    const itemRef = firebaseApp.database().ref(`/sprints/${itemId}`);
    itemRef.update({goal: this.state.selectedGoal, dueDate: this.state.dueDate});

    this.edit_toggle();
  }

  update = (itemId) => {
    const itemRef = firebaseApp.database().ref(`/sprints/${itemId}`);
    itemRef.on('value', (snapshot) => {
      if (snapshot && snapshot.exists()) {
        let task = snapshot.val();
        this.setState({
          selectedGoal: task.goal,
          dueDate: task.dueDate,
          edit_id: itemId,
          edit_modal: !this.state.edit_modal
        });
      }
    });
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

  deselectGoal = () => {
    this.setState({
      selectedGoal: ''
    });
  }

  handleInput = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.selectedGoal.length || !this.state.dueDate.length) {
      return;
    }
    const newItem = {
      releaseID: this.props.releaseID,
      projectID: this.props.projectID,
      dueDate: this.state.dueDate,
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
          dueDate: sprintsList[sprint].dueDate,
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
          dueDate: s.dueDate,
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
          <h4 className="w-50 text-center"><MDBBtn color="primary" size="sm" id="projectbtn" onClick={this.toggle} className="hvr-icon-pulse-grow"><i className="fas fa-plus hvr-icon"></i> New Sprint Plan</MDBBtn></h4>
          { sprints.length === 0 ? <h3 className="emptyTitle">Looks like you have no sprint plans try creating a new one.</h3> : null }
          {sprints.map(sprint => ( 
            <React.Fragment key={sprint.id} >     
            <MDBContainer className="w-75">
            <MDBCard className="card">
            <MDBCardBody>
            <MDBCardTitle>
            Sprint {sprint.number} 
            <MDBBtn className="editTask" color="indigo" size="sm" onClick={()=>{this.update(sprint.id)}}><i className="fas fa-edit"></i></MDBBtn>
            <MDBBtn className="deleteTask" color="danger" size="sm" onClick={() => { if (window.confirm("Are you sure you want to delete this permantly?")) this.removeSprint(sprint.id)} }>×</MDBBtn>
            </MDBCardTitle>
            Goal: {sprint.goal} <br/>
            <MDBCardText>
              Sprint Completion Date: {sprint.dueDate}<br/>
              {this.state.selectedSprint === sprint.id ? <MDBBtn color="warning" size="sm" onClick={this.closeSprint}>Close</MDBBtn> : <MDBBtn color="info" size="sm" onClick={() => this.selectSprint(sprint.id)}>Open</MDBBtn> }
            </MDBCardText>
            </MDBCardBody>
            </MDBCard>
            </MDBContainer>
            {this.state.selectedSprint === sprint.id ? <Stories user={this.props.user} sprintID={this.state.selectedSprint} /> : null}
            </React.Fragment>
          ))}
          <MDBModal isOpen={this.state.modal} toggle={this.toggle} centered>
            <MDBModalHeader toggle={this.toggle}>Create a New Sprint</MDBModalHeader>
            <MDBModalBody>
              Here is where you will pick the goal you want to guide this sprint and set the completion date.
              { goals.length === 0 ? <h5 className="emptyTitle">Looks like you have no goals try adding some goals first.</h5> : null }
              {goals.map(goal => (
                <MDBCard key={goal.id} className="card">
                <MDBCardBody>
                <MDBCardText>{goal.goalName} <br/> { goal.goalName === this.state.selectedGoal ? <MDBBtn color="success" size="sm" onClick={this.deselectGoal}><i className="fas fa-check"></i>Selected</MDBBtn> : <MDBBtn color="info" size="sm" onClick={() => this.selectGoal(goal.goalName) }>Select</MDBBtn> }</MDBCardText>
                </MDBCardBody>
                </MDBCard>
              ))}
              <MDBInput type="text" name="dueDate" label="Sprint Completion Date" onChange={this.handleInput} background outline/>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
              <MDBBtn color="primary" onClick={this.handleSubmit}>Save changes</MDBBtn>
            </MDBModalFooter>
          </MDBModal>
          <MDBModal isOpen={this.state.edit_modal} toggle={this.edit_toggle} centered>
            <MDBModalHeader toggle={this.edit_toggle}>Editing Sprint</MDBModalHeader>
            <MDBModalBody>
              { goals.length === 0 ? <h5 className="emptyTitle">Looks like you have no goals try adding some goals first.</h5> : null }
              {goals.map(goal => (
                <MDBCard key={goal.id} className="card">
                <MDBCardBody>
                <MDBCardText>{goal.goalName} <br/> { goal.goalName === this.state.selectedGoal ? <MDBBtn color="success" size="sm" onClick={this.deselectGoal}><i className="fas fa-check"></i>Selected</MDBBtn> : <MDBBtn color="info" size="sm" onClick={() => this.selectGoal(goal.goalName) }>Select</MDBBtn> }</MDBCardText>
                </MDBCardBody>
                </MDBCard>
              ))}
              <MDBInput type="text" name="dueDate" value={this.state.dueDate} label="Sprint Completion Date" onChange={this.handleInput} background outline/>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={this.edit_toggle}>Close</MDBBtn>
              <MDBBtn color="primary" onClick={()=>this.handleEdit(this.state.edit_id)}>Update</MDBBtn>
            </MDBModalFooter>
          </MDBModal>
      </React.Fragment>
    );
  }
}

export default Sprints;
