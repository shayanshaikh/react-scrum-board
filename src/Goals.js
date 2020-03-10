import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from "mdbreact";
import './index.css';
import firebaseApp from './firebaseApp';
import Modal from './Modal';

class Goals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      goalName: '',
      goals: [],
      edit_modal: false,
      edit_id: ''
    }
  }
    

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  edit_toggle = () => {
    this.setState({
      edit_modal: !this.state.edit_modal,
      goalName: ''
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
      projectID: this.props.projectID
    };

    const goalsRef = firebaseApp.database().ref('goals');
    goalsRef.push(newItem);

    this.setState(state => ({
      goalName: '',
    }));
    this.toggle();
  }

  handleEdit = (itemId) => {
    if (!this.state.goalName.length) {
      return;
    }

    const itemRef = firebaseApp.database().ref(`/goals/${itemId}`);
    itemRef.update({goalName: this.state.goalName});

    this.edit_toggle();
  }

  componentDidMount() {
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

  removeGoal(itemId) {
    const itemRef = firebaseApp.database().ref(`/goals/${itemId}`);
    itemRef.remove();
  }

  update(itemId) {
    const itemRef = firebaseApp.database().ref(`/goals/${itemId}`);
    itemRef.on('value', (snapshot) => {
      if (snapshot && snapshot.exists()) {
        let goal = snapshot.val();
        this.setState({
          goalName: goal.goalName,
          edit_id: itemId,
          edit_modal: !this.state.edit_modal
        });
      }
    });
  }


  render () {
    var goals = [];
    this.state.goals.forEach ((g) => {
      if (this.props.projectID === g.projectID) {
        goals.push(g);
      }
    });

    return (
    <React.Fragment>
      <MDBContainer>
      <MDBCard>
      <MDBCardBody>
      <MDBCardTitle>High Level Goals</MDBCardTitle>
      <MDBBtn color="primary" size="sm" onClick={this.toggle} className="hvr-icon-pulse-grow"><i className="fas fa-plus hvr-icon"></i> New HLG</MDBBtn>
      { goals.length === 0 ? <div className="emptyTitleM">Looks like you have no high level goals try creating a new one.</div> : null }
      {goals.map(goal => (
        <MDBCard key={goal.id} className="card">
        <MDBCardBody>
        {goal.goalName} 
        <MDBBtn className="editTask" color="indigo" size="sm" onClick={()=>{this.update(goal.id)}}><i className="fas fa-edit"></i></MDBBtn>
        <MDBBtn className="deleteTask" color="danger" size="sm" onClick={() => { if (window.confirm("Are you sure you want to delete this permantly?")) this.removeGoal(goal.id)} }>×</MDBBtn>
        </MDBCardBody>
        </MDBCard>
		  ))}
      </MDBCardBody>
      </MDBCard>
      </MDBContainer>
      <Modal
        title="Enter New Goal"
        button_title="Submit"
        modal_message="Here is where you will add goals you want your project to fufill and later we will use a goal as guidance for our sprint."
        input_name="goalName"
        input_label="High Level Goal"
        handleInput={this.handleInput}
        input_value={this.state.goalName}
        toggle={this.toggle}
        modal={this.state.modal}
        handleSubmit={this.handleSubmit}
      />
      <Modal
        title="Editing Goal"
        button_title="Update"
        input_name="goalName"
        input_label="High Level Goal"
        handleInput={this.handleInput}
        input_value={this.state.goalName}
        toggle={this.edit_toggle}
        modal={this.state.edit_modal}
        handleEdit={this.handleEdit}
        status="edit"
        edit_id={this.state.edit_id}
      />
		</React.Fragment>
    );
  }
}

export default Goals;