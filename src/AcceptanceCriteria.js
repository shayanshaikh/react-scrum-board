import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from "mdbreact";
import './index.css';
import firebaseApp from './firebaseApp';

class AcceptanceCriteria extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      acceptanceCriteria: '',
      acceptanceCriterias: []
    }
  }
    

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleInput = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.acceptanceCriteria.length) {
      return;
    }
    const newItem = {
      acceptanceCriteria: this.state.acceptanceCriteria,
      storyID: this.props.storyID
    };

    const acceptanceRef = firebaseApp.database().ref('acceptanceCriteria');
    acceptanceRef.push(newItem);

    this.setState(state => ({
      acceptanceCriteria: ''
    }));
  }

  componentDidMount() {
    const acceptanceRef = firebaseApp.database().ref('acceptanceCriteria');
    acceptanceRef.on('value', (snapshot) => {
      let acceptanceList = snapshot.val();
      let newState = [];
      for (let acceptance in acceptanceList) {
        newState.push({
          id: acceptance,
          acceptanceCriteria: acceptanceList[acceptance].acceptanceCriteria,
          storyID: acceptanceList[acceptance].storyID
        });
      }
      this.setState({
        acceptanceCriterias: newState
      });
    });
  }

  removeAcceptanceCriteria(itemId) {
    const itemRef = firebaseApp.database().ref(`/acceptanceCriteria/${itemId}`);
    itemRef.remove();
  }


  render () {
    var acceptanceCriterias = [];
    this.state.acceptanceCriterias.forEach ((a) => {
      if (this.props.storyID === a.storyID) {
        acceptanceCriterias.push(a);
      }
    });

    return (
    <React.Fragment>
      { acceptanceCriterias.length === 0 ? <div className="emptyTitleM">Looks like you have no acceptance criteria try creating a new one.</div> : <span style={{color:"black"}}>Did you meet the</span> }
      <MDBBtn color="primary" size="sm" onClick={this.toggle} className="hvr-icon-pulse-grow"><i className="fas fa-plus hvr-icon"></i> Acceptance Criteria</MDBBtn>
      <MDBModal isOpen={this.state.modal} toggle={this.toggle} centered scrollable>
        <MDBModalHeader toggle={this.toggle}>Enter New Acceptance Criteria</MDBModalHeader>
        <MDBModalBody>
          Here is where you will define the specific criteria that makes this user story ready to be delivered. 
          <MDBInput type="text" name="acceptanceCriteria" label="Acceptance Criteria" onChange={this.handleInput} background outline/>
          {acceptanceCriterias.map(acceptance => (
            <MDBCard key={acceptance.id} className="card">
            <MDBCardBody>
            <MDBCardText>{acceptance.acceptanceCriteria} <MDBBtn className="deleteTask" color="danger" size="sm" onClick={() => { if (window.confirm("Are you sure you want to delete this permantly?")) this.removeAcceptanceCriteria(acceptance.id)} }>×</MDBBtn></MDBCardText>
            </MDBCardBody>
            </MDBCard>
          ))}
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

export default AcceptanceCriteria;