import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from "mdbreact";
import './index.css';
import firebaseApp from './firebaseApp';

class SharedUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sharedUsers: []
    }
  }

  componentDidMount() {
    const sharedUsersRef = firebaseApp.database().ref('sharedusers');
    sharedUsersRef.on('value', (snapshot) => {
      let sharedUsersList = snapshot.val();
      let newState = [];
      for (let sharedUser in sharedUsersList) {
        newState.push({
          id: sharedUser,
          sharedUser: sharedUsersList[sharedUser].sharedUser,
          projectID: sharedUsersList[sharedUser].projectID
        });
      }
      this.setState({
        sharedUsers: newState
      });
    });
  }

  removeSharedUser(itemId) {
    const itemRef = firebaseApp.database().ref(`/sharedusers/${itemId}`);
    itemRef.remove();
  }


  render () {
    var sharedUsers = [];
    this.state.sharedUsers.forEach ((u) => {
      if (this.props.projectID === u.projectID) {
        sharedUsers.push(u);
      }
    });

    return (
      <React.Fragment>
      { sharedUsers.length !== 0 ? <h6>Users who have access:</h6> : null }
      {sharedUsers.map(sharedUser => (
        <MDBCard key={sharedUser.id} className="card">
        <MDBCardBody>
        <MDBCardText>{sharedUser.sharedUser} <MDBBtn color="danger" size="sm" onClick={() => { if (window.confirm("Are you sure you want to delete this permantly?")) this.removeSharedUser(sharedUser.id)} }>Remove Access</MDBBtn></MDBCardText>
        </MDBCardBody>
        </MDBCard>
      ))}
      </React.Fragment>
    );
  }
}

export default SharedUsers;