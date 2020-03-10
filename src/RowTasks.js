import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from "mdbreact";
import './index.css';
import firebaseApp from './firebaseApp';
import Modal from './Modal';

class RowTasks extends React.Component {
  onDragStart = (ev, id) => {
    console.log('dragstart:',id);
    ev.dataTransfer.setData("id", id);
  }

  removeTask = (itemId) => {
    const itemRef = firebaseApp.database().ref(`/tasks/${itemId}`);
    itemRef.remove();
  }

  nextTodo = (itemId) => {
    const itemRef = firebaseApp.database().ref(`/tasks/${itemId}`);
    itemRef.update({
      category:"inprogress",
      owner: this.props.user.displayName
    });
  }

  nextDone = (itemId) => {
    const itemRef = firebaseApp.database().ref(`/tasks/${itemId}`);
    itemRef.update({
      category:"done",
      owner: this.props.user.displayName
    });
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
        <MDBCard className="task" key={task.id} onDragStart = {(e) => this.onDragStart(e, task.taskName)} draggable>
        <MDBCardBody>
        <div className="taskDesc">
          {task.taskName}<br/>ETC: {task.taskPoints}<br/>Owner: {task.owner}
          <MDBBtn className="editTask task" color="indigo" size="sm" onClick={()=>{this.props.update(task.idd)}}><i className="fas fa-edit"></i></MDBBtn>
          <MDBBtn className="deleteTask task" color="danger" size="sm" onClick={() => { if (window.confirm("Are you sure you want to delete this permantly?")) this.removeTask(task.idd)} }>×</MDBBtn>
          { task.category === "todo" ? <MDBBtn className="nextButton task" color="primary" size="sm" onClick={() => this.nextTodo(task.idd)}><i className="fas fa-chevron-right"></i></MDBBtn> : null }
          { task.category === "inprogress" ? <MDBBtn className="nextButton task" color="primary" size="sm" onClick={() => this.nextDone(task.idd)}><i className="fas fa-chevron-right"></i></MDBBtn> : null }
        </div>
        </MDBCardBody>
        </MDBCard>
      ))}
      <Modal
        title="Editing Task"
        button_title="Update"
        input_name="taskName"
        input_name2="taskPoints"
        input_label="Task"
        input_label2="Time Estimate"
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
    </React.Fragment>
    );
  }
}

export default RowTasks;