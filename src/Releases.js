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
      <h5><MDBBtn color="primary" size="sm" onClick={this.toggle}>+Add</MDBBtn> new Release</h5>
      {releases.map(release => (
        <React.Fragment>
        <MDBCard key={release.id} className="card">
        <MDBCardBody>
        <MDBCardTitle>Release V{release.releaseV} <MDBBtn className="deleteTask" color="danger" size="sm" onClick={() => this.removeRelease(release.id)}>×</MDBBtn></MDBCardTitle>
        <MDBCardText>
          {this.state.selectedRelease === release.id ? <MDBBtn color="warning" size="sm" onClick={this.closeRelease}>Close</MDBBtn> : <MDBBtn color="info" size="sm" onClick={() => this.selectRelease(release.id)}>Open</MDBBtn> }
        </MDBCardText>
        </MDBCardBody>
        </MDBCard>
        {this.state.selectedRelease === release.id ? <Sprints projectID={this.props.projectID} releaseID={this.state.selectedRelease} userstories={this.props.userstories} /> : null}
        </React.Fragment>
      ))}
      </MDBContainer>
      <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
        <MDBModalHeader toggle={this.toggle}>Enter Release Version</MDBModalHeader>
        <MDBModalBody>
          <MDBInput type="text" name="releaseV" label="Version No." onChange={this.handleInput}/>
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