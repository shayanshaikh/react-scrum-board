import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from "mdbreact";
import './index.css';
import Rows from './Rows';
import Goals from './Goals';
import Sprints from './Sprints';
import Releases from './Releases';
import DOR from './DOR';
import DOD from './DOD';
import firebaseApp from './firebaseApp';

class Table extends React.Component {
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
      projectName: this.props.project.projectName,
      id: Date.now(),
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
          idd: story,
          id: stories[story].id,
          projectName: stories[story].projectName,
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
      if (s.projectName === this.props.project.projectName) {
        projectStory.push(s);
      }
    });

    return (
      <React.Fragment>
        <h1 className="heading">PROJECT {this.props.project.projectName} <MDBBtn color="warning" size="md" onClick={this.props.toggler}>Close</MDBBtn></h1>
        <div className="m-5 break"></div>
        <MDBRow>
        <MDBCol md="4"><Goals projectID={this.props.project.idd} /></MDBCol>
        <MDBCol md="4"><DOR projectID={this.props.project.idd} /></MDBCol>
        <MDBCol md="4"><DOD projectID={this.props.project.idd} /></MDBCol>
        <MDBCol md="12"><div className="m-5 break"></div></MDBCol>
        <MDBCol md="12"><h3 className="backlog">Product Backlog</h3></MDBCol>
        <MDBCol md="12"><Releases projectID={this.props.project.idd} userstories={projectStory} /></MDBCol>
        </MDBRow>
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

export default Table;