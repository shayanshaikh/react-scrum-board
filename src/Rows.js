import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from "mdbreact";
import './index.css';
import RowTasks from './RowTasks';
import AcceptanceCriteria from './AcceptanceCriteria';
import firebaseApp from './firebaseApp';
import Modal from './Modal';

class Rows extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      taskName: '',
      taskPoints: '',
      tasks: [],
      selectedStory: '',
      edit_modal: false,
      edit_id: ''
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

  edit_toggle = () => {
    this.setState({
      edit_modal: !this.state.edit_modal,
      taskName: '',
      taskPoints: ''
    });
  }

  handleEdit = (itemId) => {
    if (!this.state.taskName.length || !this.state.taskPoints.length) {
      return;
    }

    const itemRef = firebaseApp.database().ref(`/tasks/${itemId}`);
    itemRef.update({taskName: this.state.taskName, taskPoints: this.state.taskPoints});

    this.edit_toggle();
  }

  update = (itemId) => {
    const itemRef = firebaseApp.database().ref(`/tasks/${itemId}`);
    itemRef.on('value', (snapshot) => {
      if (snapshot && snapshot.exists()) {
        let task = snapshot.val();
        this.setState({
          taskName: task.taskName,
          taskPoints: task.taskPoints,
          edit_id: itemId,
          edit_modal: !this.state.edit_modal
        });
      }
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
      storyID: this.state.selectedStory,
      owner: this.props.user.displayName
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
          storyID: taskList[task].storyID,
          owner: taskList[task].owner
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
          const itemRef = firebaseApp.database().ref(`/tasks/${task.idd}`);
          itemRef.update({
            category: cat,
            owner: this.props.user.displayName
          });
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
      <h5 className="colHeader">
      User Story {userstory.number}: 
      <MDBBtn className="editTask" color="indigo" size="sm" onClick={()=>{this.props.update(userstory.id)}}><i className="fas fa-edit"></i></MDBBtn>
      <MDBBtn className="deleteTask" size="sm" color="danger" onClick={() => { if (window.confirm("Are you sure you want to delete this permantly?")) this.removeStory(userstory.id)} }>×</MDBBtn>
      </h5>
		  <MDBCard className="task"><MDBCardBody>
      <div className="userstory">{userstory.storyName}</div>
      <div className="storyPoints">Story Points: {userstory.storyPoints}</div>
      </MDBCardBody></MDBCard>
      <AcceptanceCriteria storyID={userstory.id}/>
      </MDBCol>
      <MDBCol className="border border-dark" md="3" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=>this.onDrop(e, "todo")}>
		  <h5 className="colHeader">To Do: <MDBBtn color="primary" onClick={() => this.toggleAndSet(userstory.id)} className="taskButton hvr-icon-pulse-grow"><i className="fas fa-plus hvr-icon"></i> New Task</MDBBtn></h5>
      <br/>
      { haskTasks ? null : <h3 className="emptyTitleM">Looks like you have no tasks yet try creating a new one.</h3>}
      <RowTasks 
        user={this.props.user}
        tasks={renTasks.todo} 
        storyID={userstory.id}
        handleInput={this.handleInput}
        input_value={this.state.taskName}
        input_value2={this.state.taskPoints}
        toggle={this.edit_toggle}
        modal={this.state.edit_modal}
        handleEdit={this.handleEdit}
        edit_id={this.state.edit_id}
        update={this.update}
      />
		  </MDBCol>
      <MDBCol className="border border-dark" md="3" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=>this.onDrop(e, "inprogress")}>
      <h5 className="colHeader">In Progress:</h5>
      <RowTasks 
        user={this.props.user}
        tasks={renTasks.inprogress} 
        storyID={userstory.id}
        handleInput={this.handleInput}
        input_value={this.state.taskName}
        input_value2={this.state.taskPoints}
        toggle={this.edit_toggle}
        modal={this.state.edit_modal}
        handleEdit={this.handleEdit}
        edit_id={this.state.edit_id}
        update={this.update}
      />
		  </MDBCol>
      <MDBCol className="border border-dark" md="3" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=>this.onDrop(e, "done")}>
      <h5 className="colHeader">Done:</h5>
      <RowTasks 
        user={this.props.user}
        tasks={renTasks.done} 
        storyID={userstory.id}
        handleInput={this.handleInput}
        input_value={this.state.taskName}
        input_value2={this.state.taskPoints}
        toggle={this.edit_toggle}
        modal={this.state.edit_modal}
        handleEdit={this.handleEdit}
        edit_id={this.state.edit_id}
        update={this.update}
      />
		  </MDBCol>
      </MDBRow>
		  ))}
      </div>
      <Modal
        title="Editing User Story"
        button_title="Update"
        input_name="storyName"
        input_name2="storyPoints"
        input_label="As a {user role} I want to..."
        input_label2="Story Points"
        handleInput={this.props.handleInput}
        input_value={this.props.input_value}
        input_value2={this.props.input_value2}
        toggle={this.props.toggle}
        modal={this.props.modal}
        handleEdit={this.props.handleEdit}
        second_input={true}
        status="edit"
        edit_id={this.props.edit_id}
      />
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