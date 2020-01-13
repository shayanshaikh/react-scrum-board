import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from "mdbreact";
import './index.css';
import firebaseApp from './firebaseApp';

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
      "category":"inprogress"
    });
  }

  nextDone = (itemId) => {
    const itemRef = firebaseApp.database().ref(`/tasks/${itemId}`);
    itemRef.update({
      "category":"done"
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
          {task.taskName}<br/>ETC: {task.taskPoints}
          <MDBBtn className="deleteTask task" color="danger" size="sm" onClick={() => { if (window.confirm("Are you sure you want to delete this permantly?")) this.removeTask(task.idd)} }>×</MDBBtn>
          { task.category === "todo" ? <MDBBtn className="nextButton task" color="primary" size="sm" onClick={() => this.nextTodo(task.idd)}><i className="fas fa-chevron-right"></i></MDBBtn> : null }
          { task.category === "inprogress" ? <MDBBtn className="nextButton task" color="primary" size="sm" onClick={() => this.nextDone(task.idd)}><i className="fas fa-chevron-right"></i></MDBBtn> : null }
        </div>
        </MDBCardBody>
        </MDBCard>
    ))}
    </React.Fragment>
    );
  }
}

export default RowTasks;