import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from "mdbreact";
import './index.css';
import firebaseApp from './firebaseApp';
import Rows from './Rows';

class Stories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      storyName: '',
      storyPoints: '',
      userstories: []
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
    if (!this.state.storyName.length || !this.state.storyPoints.length) {
      return;
    }
    const newItem = {
      storyName: this.state.storyName,
      storyPoints: this.state.storyPoints,
      sprintID: this.props.sprintID,
    };

    const storiesRef = firebaseApp.database().ref('userstories');
    storiesRef.push(newItem);

    this.setState(state => ({
      storyName: '',
      storyPoints: '',
    }));
    this.toggle();
  }

  componentDidMount() {
    const storiesRef = firebaseApp.database().ref('userstories');
    storiesRef.on('value', (snapshot) => {
      let stories = snapshot.val();
      let newState = [];
      for (let story in stories) {
        newState.push({
          id: story,
          sprintID: stories[story].sprintID,
          storyPoints: stories[story].storyPoints,
          storyName: stories[story].storyName
        });
      }
      this.setState({
        userstories: newState
      });
    });
  }

  render () {
    var projectStory = [];
    var i = 1;
    this.state.userstories.forEach( (s)=> {
      if (s.sprintID === this.props.sprintID) {
        const newItem = {
          id: s.id,
          sprintID: s.sprintID,
          storyPoints: s.storyPoints,
          storyName: s.storyName,
          number: i
        };
        projectStory.push(newItem);
        i = i + 1;
      }
    });

    return (
      <React.Fragment>
      <h4 className="w-75 text-center"><MDBBtn color="primary" size="sm" id="projectbtn" onClick={this.toggle}>+New User Story</MDBBtn></h4>
      <Rows userstories={projectStory} />
      <MDBModal isOpen={this.state.modal} toggle={this.toggle} centered>
        <MDBModalHeader toggle={this.toggle}>Create a New User Story</MDBModalHeader>
        <MDBModalBody>
          Recall that a user story should take the form, <div className="text-center">As a [user role], I want [goal] so that [reason]</div> and should meet the "INVEST" criteria (independent, negotiable, valuable, estimatable, sized appropriately, and testable).<br/>Then assess the difficulty of the user story and assign a story point value. 
          <MDBInput type="text" name="storyName" label="As a {user role} I want to..." onChange={this.handleInput} background outline/>
          <MDBInput type="text" name="storyPoints" label="Story Points" onChange={this.handleInput} background outline/>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
          <MDBBtn color="primary" onClick={this.handleSubmit}>Submit</MDBBtn>
        </MDBModalFooter>
      </MDBModal>
      </React.Fragment>
    );
  }
}

export default Stories;