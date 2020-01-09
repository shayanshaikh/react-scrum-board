import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from "mdbreact";
import './index.css';
import firebaseApp from './firebaseApp';
import Sprints from './Sprints';

class Releases extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      releaseV: '',
      selectedRelease: '',
      releases: []
    }
  }
    

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  selectRelease = (releaseID) => {
    this.setState({
      selectedRelease: releaseID
    });
  }

  handleInput = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.releaseV.length) {
      return;
    }
    const newItem = {
      releaseV: this.state.releaseV,
      projectID: this.props.projectID
    };

    const releasesRef = firebaseApp.database().ref('releases');
    releasesRef.push(newItem);

    this.setState(state => ({
      releaseV: ''
    }));
    this.toggle();
  }

  componentDidMount() {
    const releasesRef = firebaseApp.database().ref('releases');
    releasesRef.on('value', (snapshot) => {
      let releasesList = snapshot.val();
      let newState = [];
      for (let release in releasesList) {
        newState.push({
          id: release,
          releaseV: releasesList[release].releaseV,
          projectID: releasesList[release].projectID
        });
      }
      this.setState({
        releases: newState
      });
    });
  }

  removeRelease(itemId) {
    const itemRef = firebaseApp.database().ref(`/releases/${itemId}`);
    itemRef.remove();
  }

  closeRelease = () => {
    this.setState({
      selectedRelease: ''
    });
  }

  render () {
    var releases = [];
    this.state.releases.forEach ((r) => {
      if (this.props.projectID === r.projectID) {
        releases.push(r);
      }
    });

    return (
    <React.Fragment>
      <MDBContainer>
      <MDBBtn color="primary" size="sm" onClick={this.toggle}>+New Release Plan</MDBBtn>
      { releases.length === 0 ? <h3 className="emptyTitle">Looks like you have no release plans try creating a new one.</h3> : null }
      </MDBContainer>
      {releases.map(release => (
        <React.Fragment key={release.id}>
        <MDBContainer>
        <MDBCard className="card">
        <MDBCardBody>
        <MDBCardTitle>Release V{release.releaseV} <MDBBtn className="deleteTask" color="danger" size="sm" onClick={() => { if (window.confirm("Are you sure you want to delete this permantly?")) this.removeRelease(release.id)} }>×</MDBBtn></MDBCardTitle>
        <MDBCardText>
          {this.state.selectedRelease === release.id ? <MDBBtn color="warning" size="sm" onClick={this.closeRelease}>Close</MDBBtn> : <MDBBtn color="info" size="sm" onClick={() => this.selectRelease(release.id)}>Open</MDBBtn> }
        </MDBCardText>
        </MDBCardBody>
        </MDBCard>
        </MDBContainer>
        {this.state.selectedRelease === release.id ? <Sprints projectID={this.props.projectID} releaseID={this.state.selectedRelease} userstories={this.props.userstories} /> : null}
        </React.Fragment>
      ))}
      <MDBModal isOpen={this.state.modal} toggle={this.toggle} centered>
        <MDBModalHeader toggle={this.toggle}>Create a New Release</MDBModalHeader>
        <MDBModalBody>
          To begin planning Sprints enter a release version number.
          <MDBInput type="text" name="releaseV" label="Version No." onChange={this.handleInput} background outline/>
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

export default Releases;