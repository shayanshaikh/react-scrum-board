import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBContainer, MDBRow, MDBCol } from "mdbreact";
import './index.css';
import Goals from './Goals';
import Releases from './Releases';
import DOR from './DOR';
import Standupsend from './Standupsend';
import DOD from './DOD';
import firebaseApp from './firebaseApp';
import { Link, withRouter } from 'react-router-dom';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      projectName: '',
      projectidd: '',
      storyName: '',
      userstories: [],
      countDownDate: new Date().getTime()
    }
  }
    

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  resetTimer = () => {
    this.setState({
      countDownDate: new Date().getTime()
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
      projectName: this.state.projectName,
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
    const id = this.props.match.params.id;
    const projectRef = firebaseApp.database().ref(`/projects/${id}`);
    projectRef.on('value', (snapshot) => {
      let proj = snapshot.val();
      this.setState({
        projectName: proj.projectName,
        projectidd: id
      });
    });

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

  componentWillUnmount() {
    this.setState({
        projectName: '',
        projectidd: ''
      });
  }

  render () {
    var projectStory = []

    this.state.userstories.forEach( (s)=> {
      if (s.projectName === this.state.projectName) {
        projectStory.push(s);
      }
    });

    return (
      <React.Fragment>
      <div className="scrum-board">
        <MDBContainer className="max-wide">
          <MDBRow className="d-flex justify-content-center heading">
          <div className="chalk">{this.state.projectName}</div> 
          <Link to=".."><MDBBtn className="closing" color="warning" size="md" >Close</MDBBtn></Link>
          </MDBRow>
        
        <MDBRow>
        <MDBCol md="12"><Standupsend projectID={this.state.projectidd} /></MDBCol>
        </MDBRow>

        <div className="m-5 break"></div>
        <MDBRow>
        <MDBCol md="4" className="no-pads"><Goals projectID={this.state.projectidd} /></MDBCol>
        <MDBCol md="4" className="no-pads"><DOR projectID={this.state.projectidd} /></MDBCol>
        <MDBCol md="4" className="no-pads"><DOD projectID={this.state.projectidd} /></MDBCol>
        </MDBRow>
        <MDBRow>
        <MDBCol md="12" className="no-pads"><div className="m-5 break"></div></MDBCol>
        </MDBRow>
        <MDBRow>
        <MDBCol md="12" className="no-pads"><h3 className="backlog">Release Plans</h3></MDBCol>
        </MDBRow>
        <MDBRow>
        <MDBCol md="12" className="no-pads"><Releases user={this.props.user} projectID={this.state.projectidd} userstories={projectStory} /></MDBCol>
        </MDBRow>
        </MDBContainer>

      </div>


        <MDBModal isOpen={this.state.modal} toggle={this.toggle} centered>
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

export default withRouter(Table);