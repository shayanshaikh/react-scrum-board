import React from 'react';
import ReactDOM from 'react-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol, MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import './index.css';
import Navbar from './Navbar';
import * as serviceWorker from './serviceWorker';
import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseApp from './firebaseApp';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showResults: false,
      toggledProject: ''
    }
  }
    
  removeProject(itemId) {
    const itemRef = firebaseApp.database().ref(`/projects/${itemId}`);
    itemRef.remove();
  }

  toggle = (name) => {
    this.setState({
      showResults: true,
      toggledProject: name
    });
    this.props.toggler();
  }

  closeProject = () => {
    this.setState({
      showResults: false,
      toggledProject: ''
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
        
        { this.state.showResults ? <Table toggler={this.closeProject} name={this.state.toggledProject} />
        : projects.map(project => (
            <MDBCard key={project.id} style={{margin:10}}>
            <MDBCardBody>
            <MDBCardTitle>Project {project.projectName}</MDBCardTitle>
            <MDBCardText>
              <MDBBtn color="primary" size="sm" onClick={() => this.toggle(project.projectName)}>Open</MDBBtn>
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
//
//

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
    return (
      <MDBContainer>
        <Navbar user={this.props.user} signOut={this.props.signOut} signInWithGoogle={this.props.signInWithGoogle}/>
        {
          (user && this.state.projectToggled)
            ? <React.Fragment>
              <h1 className="heading">Scrum Planning<br />Made Simple</h1>
              <h3 className="text-center" style={{marginBottom: 50}}>Welcome {user.displayName}</h3>
              <h4>Create a New Project!<MDBBtn color="primary" size="md" id="projectbtn" onClick={this.toggle}>+</MDBBtn></h4>
              </React.Fragment>
            : null
        }
        { user ? 
          <MDBContainer><Project toggler={this.projtoggle} projects={this.state.projects} /></MDBContainer>
          : <MDBContainer><h1 className="heading">Scrum Made Simple</h1><h2 className="heading">Please login above to use our beautiful services.</h2><StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseApp.auth()}/></MDBContainer> }
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
      </MDBContainer>
    );
  }
}

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
      projectName: this.props.name,
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
      if (s.projectName === this.props.name) {
        projectStory.push(s);
      }
    });

    return (
      <MDBContainer className="table">
        <h1 style={{margin: 50}}>PROJECT {this.props.name} <MDBBtn color="primary" size="md" onClick={this.props.toggler}>Close</MDBBtn></h1>
        <h3 style={{marginBottom: 50}}>Product Backlog</h3>
        <h4>Add new User Stories</h4>
        <MDBRow className="border border-dark">
        <MDBCol md="3" className="border border-dark">
        <h5 className='title'>User Stories</h5><MDBBtn color="primary" size="sm" id="projectbtn" onClick={this.toggle}>+Add</MDBBtn>
        </MDBCol>
        <MDBCol md="3" className="border border-dark">
        <h5 className='title'>To Do</h5>
        </MDBCol>
        <MDBCol md="3" className="border border-dark">
        <h5 className='title'>In Progress</h5>
        </MDBCol>
        <MDBCol md="3" className="border border-dark">
        <h5 className='title'>Done</h5>
        </MDBCol>
        </MDBRow>
        <Rows userstories={projectStory} />
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
      </MDBContainer>
    );
  }
}
class Rows extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      taskName: '',
      tasks: [],
      selectedStory: ''
    }
  }
    

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggleAndSet = (name) => {
    this.setState({
      modal: !this.state.modal,
      selectedStory: name
    });
  }

  handleInput = (input) => {
    this.setState({
      taskName: input
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.taskName.length) {
      return;
    }
    const newItem = {
      taskName: this.state.taskName,
      id: Date.now(),
      category: "todo",
      storyID: this.state.selectedStory
    };

    const tasksRef = firebaseApp.database().ref('tasks');
    tasksRef.push(newItem);

    this.setState(state => ({
      taskName: ''
    }));
    this.toggle();
  }

  componentDidMount() {
    const tasksRef = firebaseApp.database().ref('tasks');
    tasksRef.on('value', (snapshot) => {
      let taskList = snapshot.val();
      let newState = [];
      for (let task in taskList) {
        newState.push({
          idd: task,
          id: taskList[task].id,
          category: taskList[task].category,
          taskName: taskList[task].taskName,
          storyID: taskList[task].storyID
        });
      }
      this.setState({
        tasks: newState
      });
    });
  }

  onDragStart = (ev, id) => {
      console.log('dragstart1:',id);
      ev.dataTransfer.setData("id", id);
  }

  onDragOver = (ev) => {
      ev.preventDefault();
  }

  onDrop = (ev, cat) => {
     let id = ev.dataTransfer.getData("id");

     let tasks = this.state.tasks.filter((task) => {
         if (task.taskName === id) {
          const newItem = {
            taskName: task.taskName,
            id: task.id,
            category: cat,
            storyID: task.storyID
          };
          
          const itemRef = firebaseApp.database().ref(`/tasks/${task.idd}`);
          itemRef.remove();
          const tasksRef = firebaseApp.database().ref('tasks');
          tasksRef.push(newItem);
          task.category = cat;
         }
         return task;
     });
  }

  removeStory(itemId) {
    const itemRef = firebaseApp.database().ref(`/userstories/${itemId}`);
    itemRef.remove();
  }

  render () {
    var renTasks = {
      todo: [],
      inprogress: [],
      done: []
    }

    this.state.tasks.forEach ((t) => {
      renTasks[t.category].push(t);
    });

    return (
    <React.Fragment>
		  {this.props.userstories.map(userstory => (
      <MDBRow className="border border-dark" key={userstory.id}>
      <MDBCol md="3" className="border border-dark">
		  <h5>{userstory.storyName}</h5>
      <MDBBtn color="primary" size="sm" onClick={() => this.removeStory(userstory.idd)}>Delete</MDBBtn>
      </MDBCol>
      <MDBCol className="border border-dark" md="3" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=>this.onDrop(e, "todo")}>
		  <MDBBtn color="primary" size="sm" onClick={() => this.toggleAndSet(userstory.id)}>+Task</MDBBtn>
      <br/>
      <RowTasks tasks={renTasks.todo} storyID={userstory.id}/>
		  </MDBCol>
      <MDBCol className="border border-dark" md="3" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=>this.onDrop(e, "inprogress")}>
      <RowTasks tasks={renTasks.inprogress} storyID={userstory.id}/>
		  </MDBCol>
      <MDBCol className="border border-dark" md="3" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=>this.onDrop(e, "done")}>
      <RowTasks tasks={renTasks.done} storyID={userstory.id}/>
		  </MDBCol>
      </MDBRow>
		  ))}
      <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
        <MDBModalHeader toggle={this.toggle}>Create New Task</MDBModalHeader>
        <MDBModalBody>
          Task: <MDBInput type="text" label="tasking" getValue={this.handleInput}/>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
          <MDBBtn color="primary" onClick={this.handleSubmit}>Save changes</MDBBtn>
        </MDBModalFooter>
      </MDBModal>
		</React.Fragment>
    );
  }
}
class RowTasks extends React.Component {
  onDragStart = (ev, id) => {
    console.log('dragstart:',id);
    ev.dataTransfer.setData("id", id);
  }

  removeTask(itemId) {
    const itemRef = firebaseApp.database().ref(`/tasks/${itemId}`);
    itemRef.remove();
  }

  render () {
    var storyTasks = []
    this.props.tasks.forEach( (t)=> {
      if (t.storyID === this.props.storyID) {
        storyTasks.push(t);
      }
    });
    return (
    <React.Fragment>
      {storyTasks.map(task => (
        <MDBCard key={task.id} style={{margin:10}} onDragStart = {(e) => this.onDragStart(e, task.taskName)} draggable>
        <MDBCardBody>
        <MDBCardText>
          {task.taskName}<br/>
          <MDBBtn className="deleteTask" color="primary" size="sm" onClick={() => this.removeTask(task.idd)}>×</MDBBtn>
        </MDBCardText>
        </MDBCardBody>
        </MDBCard>
    ))}
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
  signInSuccessUrl: '/signedIn',
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
