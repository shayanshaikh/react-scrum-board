import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from "mdbreact";
import './index.css';
import Table from './Table';
import firebaseApp from './firebaseApp';

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showResults: false,
      toggledProject: []
    }
  }
    
  removeProject(itemId) {
    const itemRef = firebaseApp.database().ref(`/projects/${itemId}`);
    itemRef.remove();
  }

  toggle = (project) => {
    this.setState({
      showResults: true,
      toggledProject: project
    });
    this.props.toggler();
  }

  closeProject = () => {
    this.setState({
      showResults: false,
      toggledProject: []
    });
    this.props.toggler();
  }

  open = (projectName) => {
    return <Table name={projectName} />;
  }

  render () {
    var projects = []

    this.props.projects.forEach( (p)=> {
      if (p.userID === firebaseApp.auth().currentUser.uid) {
        projects.push(p);
      }
    });

    return (
      <MDBContainer>
        
        { this.state.showResults ? <Table toggler={this.closeProject} project={this.state.toggledProject} />
        : projects.map(project => (
            <MDBCard key={project.id} className="card">
            <MDBCardBody>
            <MDBCardTitle>Project {project.projectName}</MDBCardTitle>
            <MDBCardText>
              <MDBBtn color="primary" size="sm" onClick={() => this.toggle(project)}>Open</MDBBtn>
              <MDBBtn color="primary" size="sm" onClick={() => this.removeProject(project.idd)}>Delete</MDBBtn>
            </MDBCardText>
            </MDBCardBody>
            </MDBCard>
          ))
        }
      </MDBContainer>
    );
  }
}

export default Project;
