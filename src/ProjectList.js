import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './index.css';
import './hover-min.css';
import Navbar from './Navbar';
import Footer from './Footer';
import Project from './Project';
import Table from './Table';
import HomePage from './HomePage';
import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseApp from './firebaseApp';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import ScrollToTop from './ScrollToTop';
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect } from 'react-router-dom';

class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    }
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
      //loading,
    } = this.props;
    var signUp = <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseApp.auth()}/>;

    return (
      <React.Fragment>
        <Router>
        <ScrollToTop />
        <Navbar user={user} signOut={signOut} signUp={signUp} signInWithGoogle={signInWithGoogle} projects={this.state.projects}/>
        <Switch>
          <Route path="/dashboard/projects/:id">
            { user ? <Table user={user} /> : <Redirect to='/' /> }
          </Route>
          <Route path="/dashboard">
            { user ? <Project user={user} projects={this.state.projects} /> : <Redirect to='/' /> }
          </Route>
          <Route path="/">
            <HomePage   className="scrum-board" user={user}  />
          </Route>
        </Switch>
        <Footer />

        </Router>

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
  //signInFlow: 'popup',
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
