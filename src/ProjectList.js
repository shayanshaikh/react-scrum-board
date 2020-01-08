import React from 'react';
import ReactDOM from 'react-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from "mdbreact";
import './index.css';
import Navbar from './Navbar';
import Footer from './Footer';
import Project from './Project';
import * as serviceWorker from './serviceWorker';
import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseApp from './firebaseApp';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      projectName: '',
      projects: [],
      projectToggled: true
    }
    this.toggle = this.toggle.bind(this);
  }
    

  toggle () {
    this.setState({
      modal: !this.state.modal
    });
  }

  projtoggle = () => {
    this.setState({
      projectToggled: !this.state.projectToggled
    });
  }

  handleInput = (input) => {
    this.setState({
      projectName: input
    });
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

  componentDidMount() {
    const projectsRef = firebaseApp.database().ref('projects');
    projectsRef.on('value', (snapshot) => {
      let projects = snapshot.val();
      let newState = [];
      for (let project in projects) {
        newState.push({
          idd: project,
          id: projects[project].id,
          projectName: projects[project].projectName,
          userID: projects[project].userID
        });
      }
      this.setState({
        projects: newState
      });
    });
  }

  render () {
    const {
      user,
      signOut,
      signInWithGoogle,
      loading,
    } = this.props;
    var signUp = <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseApp.auth()}/>;

    return (
      <React.Fragment>
        <Navbar user={this.props.user} signOut={this.props.signOut} signUp={signUp} signInWithGoogle={this.props.signInWithGoogle}/>
        {
          (user && this.state.projectToggled)
            ? <MDBContainer>
              <h1 className="heading">Scrum Planning<br />Made Simple</h1>
              <h3 className="text-center" style={{marginBottom: 50}}>Welcome {user.displayName}</h3>
              <h4><MDBBtn color="primary" size="md" id="projectbtn" onClick={this.toggle}>+New Project</MDBBtn></h4>
              </MDBContainer>
            : null
        }
        { user ? 
          <Project toggler={this.projtoggle} projects={this.state.projects} />
          : <MDBContainer><h1 className="heading">Scrum Made Simple (Beta)</h1><h2 className="heading">Please login above to use our beautiful services.</h2></MDBContainer> }
        <Footer />

        <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
          <MDBModalHeader toggle={this.toggle}>Enter Project Details</MDBModalHeader>
          <MDBModalBody>
            <MDBInput type="text" label="Project Name" getValue={this.handleInput} background outline/>
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

const firebaseAppAuth = firebaseApp.auth();
 
/** See the signature above to find out the available providers */
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ]
};

firebaseApp.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log(user.uid);
  } else {
  }
});

/** Wrap it */
export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(ProjectList);
