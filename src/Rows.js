import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from "mdbreact";
import './index.css';
import RowTasks from './RowTasks';
import firebaseApp from './firebaseApp';

class Rows extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      taskName: '',
      taskPoints: '',
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

  handleInput = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.taskName.length || !this.state.taskPoints.length) {
      return;
    }
    const newItem = {
      taskName: this.state.taskName,
      taskPoints: this.state.taskPoints,
      id: Date.now(),
      category: "todo",
      storyID: this.state.selectedStory
    };

    const tasksRef = firebaseApp.database().ref('tasks');
    tasksRef.push(newItem);

    this.setState(state => ({
      taskName: '',
      taskPoints: ''
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
          taskPoints: taskList[task].taskPoints,
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
            taskPoints: task.taskPoints,
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
    var haskTasks = false;

    this.state.tasks.forEach ((t) => {
      renTasks[t.category].push(t);
    });

    this.props.userstories.forEach( (s)=> {
      this.state.tasks.forEach( (t)=> {
        if (t.storyID === s.id) {
          haskTasks = true;
        }
      });
    });


    return (
    <React.Fragment>
      <div className="scrumBoard">
      { this.props.userstories.length === 0 ? <h3 className="emptyTitle">Looks like you have no userstories try creating a new one.</h3> : null }
		  {this.props.userstories.map(userstory => (
      <MDBRow className="border border-dark" key={userstory.id}>
      <MDBCol md="3" className="border border-dark">
      <h5 className="colHeader">User Story {userstory.number}: <MDBBtn className="deleteTask" size="sm" color="danger" onClick={() => { if (window.confirm("Are you sure you want to delete this permantly?")) this.removeStory(userstory.id)} }>×</MDBBtn></h5>
		  <MDBCard className="task"><MDBCardBody><MDBCardText>
      <div className="userstory">{userstory.storyName}</div>
      <div className="storyPoints">Story Points: {userstory.storyPoints}</div>
      </MDBCardText></MDBCardBody></MDBCard>
      </MDBCol>
      <MDBCol className="border border-dark" md="3" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=>this.onDrop(e, "todo")}>
		  <h5 className="colHeader">To Do: <MDBBtn className="taskButton" color="primary" onClick={() => this.toggleAndSet(userstory.id)}>+New Task</MDBBtn></h5>
      <br/>
      { haskTasks ? null : <h3 className="emptyTitleM">Looks like you have no tasks yet try creating a new one.</h3>}
      <RowTasks tasks={renTasks.todo} storyID={userstory.id}/>
		  </MDBCol>
      <MDBCol className="border border-dark" md="3" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=>this.onDrop(e, "inprogress")}>
      <h5 className="colHeader">In Progress:</h5>
      <RowTasks tasks={renTasks.inprogress} storyID={userstory.id}/>
		  </MDBCol>
      <MDBCol className="border border-dark" md="3" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=>this.onDrop(e, "done")}>
      <h5 className="colHeader">Done:</h5>
      <RowTasks tasks={renTasks.done} storyID={userstory.id}/>
		  </MDBCol>
      </MDBRow>
		  ))}
      </div>
      <MDBModal isOpen={this.state.modal} toggle={this.toggle} centered>
        <MDBModalHeader toggle={this.toggle}>Create a New Task</MDBModalHeader>
        <MDBModalBody>
          Describe a task that will help you achieve your user story. Then give a time estimate (make sure to play planning poker).
          <MDBInput type="text" name="taskName" label="Task" onChange={this.handleInput} background outline/>
          <MDBInput type="text" name="taskPoints" label="Time Estimate" onChange={this.handleInput} background outline/>
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

export default Rows;