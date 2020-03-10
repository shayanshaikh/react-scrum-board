import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from "mdbreact";
import './index.css';
import firebaseApp from './firebaseApp';
import Sprints from './Sprints';
import Modal from './Modal';

class Releases extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      releaseV: '',
      selectedRelease: '',
      dueDate: '',
      releases: [],
      edit_modal: false,
      edit_id: ''
    }
  }

  edit_toggle = () => {
    this.setState({
      edit_modal: !this.state.edit_modal,
      releaseV: '',
      dueDate: ''
    });
  }

  handleEdit = (itemId) => {
    if (!this.state.releaseV.length || !this.state.dueDate.length) {
      return;
    }

    const itemRef = firebaseApp.database().ref(`/releases/${itemId}`);
    itemRef.update({releaseV: this.state.releaseV, dueDate: this.state.dueDate});

    this.edit_toggle();
  }

  update = (itemId) => {
    const itemRef = firebaseApp.database().ref(`/releases/${itemId}`);
    itemRef.on('value', (snapshot) => {
      if (snapshot && snapshot.exists()) {
        let task = snapshot.val();
        this.setState({
          releaseV: task.releaseV,
          dueDate: task.dueDate,
          edit_id: itemId,
          edit_modal: !this.state.edit_modal
        });
      }
    });
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
    if (!this.state.releaseV.length || !this.state.dueDate.length) {
      return;
    }
    const newItem = {
      releaseV: this.state.releaseV,
      dueDate: this.state.dueDate,
      projectID: this.props.projectID
    };

    const releasesRef = firebaseApp.database().ref('releases');
    releasesRef.push(newItem);

    this.setState(state => ({
      releaseV: '',
      dueDate: ''
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
          dueDate: releasesList[release].dueDate,
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
      <MDBBtn color="primary" size="sm" onClick={this.toggle} className="hvr-icon-pulse-grow"><i className="fas fa-plus hvr-icon"></i> New Release Plan</MDBBtn>
      { releases.length === 0 ? <h3 className="emptyTitle">Looks like you have no release plans try creating a new one.</h3> : null }
      </MDBContainer>
      {releases.map(release => (
        <React.Fragment key={release.id}>
        <MDBContainer>
        <MDBCard className="card">
        <MDBCardBody>
        <MDBCardTitle>
        Release V{release.releaseV} 
        <MDBBtn className="editTask" color="indigo" size="sm" onClick={()=>{this.update(release.id)}}><i className="fas fa-edit"></i></MDBBtn>
        <MDBBtn className="deleteTask" color="danger" size="sm" onClick={() => { if (window.confirm("Are you sure you want to delete this permantly?")) this.removeRelease(release.id)} }>×</MDBBtn>
        </MDBCardTitle>
        <MDBCardText>
          Release Date: {release.dueDate}<br/>
          {this.state.selectedRelease === release.id ? <MDBBtn color="warning" size="sm" onClick={this.closeRelease}>Close</MDBBtn> : <MDBBtn color="info" size="sm" onClick={() => this.selectRelease(release.id)}>Open</MDBBtn> }
        </MDBCardText>
        </MDBCardBody>
        </MDBCard>
        </MDBContainer>
        {this.state.selectedRelease === release.id ? <Sprints user={this.props.user} projectID={this.props.projectID} releaseID={this.state.selectedRelease} userstories={this.props.userstories} /> : null}
        </React.Fragment>
      ))}
      <Modal
        title="Editing Release"
        button_title="Update"
        input_name="releaseV"
        input_name2="dueDate"
        input_label="Version No."
        input_label2="Release Date"
        handleInput={this.handleInput}
        input_value={this.state.releaseV}
        input_value2={this.state.dueDate}
        toggle={this.edit_toggle}
        modal={this.state.edit_modal}
        handleEdit={this.handleEdit}
        second_input={true}
        status="edit"
        edit_id={this.state.edit_id}
      />
      <Modal
        title="Create a New Release"
        button_title="Submit"
        modal_message="To begin planning Sprints enter a release version number and release date."
        input_name="releaseV"
        input_name2="dueDate"
        input_label="Version No."
        input_label2="Release Date"
        handleInput={this.handleInput}
        toggle={this.toggle}
        modal={this.state.modal}
        handleSubmit={this.handleSubmit}
        second_input={true}
      />
		</React.Fragment>
    );
  }
}

export default Releases;