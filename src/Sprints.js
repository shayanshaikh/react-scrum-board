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
      selectedSprint: ''
    }
  }
    
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      releaseID: this.props.releaseID,
      projectID: this.props.projectID
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
          projectID: sprintsList[sprint].projectID
        });
      }
      this.setState({
        sprints: newState
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
    var i = 1;
    this.state.sprints.forEach ((s) => {
      if (this.props.projectID === s.projectID && this.props.releaseID === s.releaseID) {
        const newItem = {
          id: s.id,
          releaseID: s.releaseID,
          projectID: s.projectID,
          number: i
        };
        sprints.push(newItem);
        i = i + 1;
      }
    });

    return (
      <React.Fragment>
          <h4 className="w-50 text-center"><MDBBtn color="primary" size="sm" id="projectbtn" onClick={this.handleSubmit}>+Add</MDBBtn> new Sprint</h4>
          {sprints.map(sprint => ( 
            <React.Fragment>     
            <MDBContainer className="w-75">
            <MDBCard key={sprint.id} className="card">
            <MDBCardBody>
            <MDBCardTitle>Sprint {sprint.number} <MDBBtn className="deleteTask" color="danger" size="sm" onClick={() => this.removeSprint(sprint.id)}>×</MDBBtn></MDBCardTitle>
            <MDBCardText>
              {this.state.selectedSprint === sprint.id ? <MDBBtn color="warning" size="sm" onClick={this.closeSprint}>Close</MDBBtn> : <MDBBtn color="info" size="sm" onClick={() => this.selectSprint(sprint.id)}>Open</MDBBtn> }
            </MDBCardText>
            </MDBCardBody>
            </MDBCard>
            </MDBContainer>
            {this.state.selectedSprint === sprint.id ? <Stories sprintID={this.state.selectedSprint} /> : null}
            </React.Fragment>
          ))}
      </React.Fragment>
    );
  }
}

export default Sprints;
