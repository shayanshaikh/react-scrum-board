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
      userstories: []
    }
  }
    

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleInput = (input) => {
    this.setState({
      storyName: input
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.storyName.length) {
      return;
    }
    const newItem = {
      storyName: this.state.storyName,
      sprintID: this.props.sprintID,
    };

    const storiesRef = firebaseApp.database().ref('userstories');
    storiesRef.push(newItem);

    this.setState(state => ({
      storyName: ''
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
          storyName: stories[story].storyName
        });
      }
      this.setState({
        userstories: newState
      });
    });
  }

  render () {
    var projectStory = []

    this.state.userstories.forEach( (s)=> {
      if (s.sprintID === this.props.sprintID) {
        projectStory.push(s);
      }
    });

    return (
      <React.Fragment>
      <h4 className="w-75 text-center"><MDBBtn color="primary" size="sm" id="projectbtn" onClick={this.toggle}>+Add</MDBBtn> new User Stories</h4>
      <MDBContainer className="table">
        <Rows userstories={projectStory} />
      </MDBContainer>
      <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
        <MDBModalHeader toggle={this.toggle}>Create New User Story</MDBModalHeader>
        <MDBModalBody>
          <MDBInput type="text" label="As a {user role} I want to..." getValue={this.handleInput} outline/>
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