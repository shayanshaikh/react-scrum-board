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
          <MDBBtn className="deleteTask" color="danger" size="sm" onClick={() => this.removeTask(task.idd)}>×</MDBBtn>
        </MDBCardText>
        </MDBCardBody>
        </MDBCard>
    ))}
    </React.Fragment>
    );
  }
}

export default RowTasks;