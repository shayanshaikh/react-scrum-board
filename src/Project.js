import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCol } from "mdbreact";
import './index.css';
import Countdown from './Countdown';
import SharedUsers from './SharedUsers';
import firebaseApp from './firebaseApp';
import Modal from './Modal';
import { Link } from 'react-router-dom';

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      share_modal: false,
      projectName: '',
      showResults: false,
      sharedUser: '',
      selectedProject: '',
      sharedUsers: [],
      toggledProject: [],
      edit_modal: false,
      edit_id: ''
    }
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  shareToggle = () => {
    this.setState({
      share_modal: !this.state.share_modal
    });
  }

  shareModal = (proj) => {
    this.setState({
      share_modal: !this.state.share_modal,
      selectedProject: proj
    });
  }

  edit_toggle = () => {
    this.setState({
      edit_modal: !this.state.edit_modal,
      selectedProject: ''
    });
  }

  handleInput = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.projectName.length) {
      return;
    }
    const newItem = {
      projectName: this.state.projectName,
      id: Date.now(),
      userID: firebaseApp.auth().currentUser.uid,
    };

    const projectsRef = firebaseApp.database().ref('projects');
    projectsRef.push(newItem);

    this.setState(state => ({
      projectName: ''
    }));
    this.toggle();
  }

  handleShareSubmit = (e) => {
    e.preventDefault();
    if (!this.state.sharedUser.length) {
      return;
    }
    const newItem = {
      sharedUser: this.state.sharedUser,
      projectID: this.state.selectedProject
    };

    const usersRef = firebaseApp.database().ref('sharedusers');
    usersRef.push(newItem);

    this.setState(state => ({
      sharedUser: ''
    }));
  }

  handleEdit = (itemId) => {
    if (!this.state.selectedProject.length) {
      return;
    }

    const itemRef = firebaseApp.database().ref(`/projects/${itemId}`);
    itemRef.update({projectName: this.state.selectedProject});

    this.edit_toggle();
  }

  componentDidMount() {
    const usersRef = firebaseApp.database().ref('sharedusers');
    usersRef.on('value', (snapshot) => {
      let users = snapshot.val();
      let newState = [];
      for (let user in users) {
        newState.push({
          id: user,
          projectID: users[user].projectID,
          sharedUser: users[user].sharedUser
        });
      }
      this.setState({
        sharedUsers: newState
      });
    });
  }
    
  removeProject(itemId) {
    const itemRef = firebaseApp.database().ref(`/projects/${itemId}`);
    itemRef.remove();
  }

  updateProject(itemId) {
    const itemRef = firebaseApp.database().ref(`/projects/${itemId}`);
    itemRef.on('value', (snapshot) => {
      let proj = snapshot.val();
      this.setState({
        selectedProject: proj.projectName,
        edit_id: itemId,
        edit_modal: !this.state.edit_modal
      });
    });
  }

  openProject = (project) => {
    this.setState({
      showResults: true,
      toggledProject: project
    });
  }

  closeProject = () => {
    this.setState({
      showResults: false,
      toggledProject: []
    });
  }

  render () {
    var projects = []
    var sharedProjects = []

    this.props.projects.forEach( (p)=> {
      if (p.userID === firebaseApp.auth().currentUser.uid) {
        projects.push(p);
      }
      this.state.sharedUsers.forEach( (u)=> {
        if (u.projectID === p.idd && u.sharedUser === firebaseApp.auth().currentUser.email) {
          sharedProjects.push(p);
        }
      });
    });

    if (projects.length === 0) { var no_projects = <h3 className="emptyTitle">Looks like you have no projects try creating a new one.</h3> }

    return (
      <React.Fragment>
        <MDBContainer  className="scrum-board">        
          <h1 className="heading chalk">Scrum Planning<br/>Made Simple (ßeta...)</h1>
          {/*<h3 className="welcomeUser">Welcome {user.displayName}</h3>*/}
          <h4 className="text-center"><MDBBtn color="primary" size="lg" id="projectbtn" onClick={this.toggle} className="hvr-icon-pulse-grow"><i className="fas fa-plus hvr-icon"></i> New Project</MDBBtn></h4>
          { no_projects }

          <div className="m-5"><h4>Your Projects</h4><div className="break"></div></div>
          { projects.map(project => (
            <MDBCard key={project.id} className="card">
            <MDBCardBody>
            <MDBRow>
            <MDBCol md="6">
            <MDBCardTitle>Project: {project.projectName}</MDBCardTitle>
            <MDBCardText>
              <Link to={"/dashboard/projects/" + project.idd}><MDBBtn color="info" size="sm" >Open</MDBBtn></Link>
              <MDBBtn color="secondary" size="sm" onClick={() => this.shareModal(project.idd)} className="hvr-icon-pulse-grow"><i className="fas fa-user-plus hvr-icon"></i> Share</MDBBtn>
              <MDBBtn color="indigo" size="sm" onClick={()=>{this.updateProject(project.idd)}} className="hvr-icon-pulse-grow"><i className="fas fa-edit hvr-icon"></i> Edit</MDBBtn>
              <MDBBtn color="danger" size="sm" onClick={() => { if (window.confirm("Are you sure you want to delete this permantly?")) this.removeProject(project.idd)} }>Delete</MDBBtn>
            </MDBCardText>
            </MDBCol>
            <MDBCol md="2">
            </MDBCol>
            <MDBCol md="4">
            <Countdown projectID={project.idd} />
            </MDBCol>
            </MDBRow>
            </MDBCardBody>
            </MDBCard>
          ))
          }
          
          <div className="m-5"><h4>Projects Shared with You</h4><div className="break"></div></div>
          { sharedProjects.map(project => (
              <MDBCard key={project.id} className="card">
              <MDBCardBody>
              <MDBCardTitle>Project: {project.projectName}</MDBCardTitle>
              <MDBCardText>
                <MDBBtn color="info" size="sm" onClick={() => this.openProject(project)}>Open</MDBBtn>
              </MDBCardText>
              </MDBCardBody>
              </MDBCard>
            ))
          }          
        </MDBContainer>

        <Modal
          title="Editing Project"
          button_title="Update"
          input_name="selectedProject"
          input_label="Project Name"
          handleInput={this.handleInput}
          input_value={this.state.selectedProject}
          toggle={this.edit_toggle}
          modal={this.state.edit_modal}
          handleEdit={this.handleEdit}
          status="edit"
          edit_id={this.state.edit_id}
        />

        <MDBModal isOpen={this.state.modal} toggle={this.toggle} centered>
          <MDBModalHeader toggle={this.toggle}>Create a New Project</MDBModalHeader>
          <MDBModalBody>
            First step is to give your project a name.
            <MDBInput type="text" label="Project Name" name="projectName" onChange={this.handleInput} background outline/>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
            <MDBBtn color="primary" onClick={this.handleSubmit}>Submit</MDBBtn>
          </MDBModalFooter>
        </MDBModal>

        <MDBModal isOpen={this.state.share_modal} toggle={this.shareToggle} centered scrollable>
          <MDBModalHeader toggle={this.shareToggle}>Share Project Access</MDBModalHeader>
          <MDBModalBody>
            <MDBInput type="text" name="sharedUser" label="enter email to share" onChange={this.handleInput} background outline/>
            <SharedUsers projectID={this.state.selectedProject} />
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={this.shareToggle}>Close</MDBBtn>
            <MDBBtn color="primary" onClick={this.handleShareSubmit}>Submit</MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </React.Fragment>
    );
  }
}

export default Project;
