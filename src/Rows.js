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

export default Rows;