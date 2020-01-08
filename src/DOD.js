import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from "mdbreact";
import './index.css';
import firebaseApp from './firebaseApp';

class DOD extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      definition: '',
      definitions: []
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
    if (!this.state.definition.length) {
      return;
    }
    const newItem = {
      definition: this.state.definition,
      projectID: this.props.projectID
    };

    const definitionsRef = firebaseApp.database().ref('dod');
    definitionsRef.push(newItem);

    this.setState(state => ({
      definition: ''
    }));
    this.toggle();
  }

  componentDidMount() {
    const definitionsRef = firebaseApp.database().ref('dod');
    definitionsRef.on('value', (snapshot) => {
      let definitionList = snapshot.val();
      let newState = [];
      for (let definition in definitionList) {
        newState.push({
          id: definition,
          definition: definitionList[definition].definition,
          projectID: definitionList[definition].projectID
        });
      }
      this.setState({
        definitions: newState
      });
    });
  }

  removeDOD(itemId) {
    const itemRef = firebaseApp.database().ref(`/dod/${itemId}`);
    itemRef.remove();
  }


  render () {
    var definitions = [];
    this.state.definitions.forEach ((d) => {
      if (this.props.projectID === d.projectID) {
        definitions.push(d);
      }
    });

    return (
    <React.Fragment>
      <MDBContainer>
      <MDBCard className="card">
      <MDBCardBody>
      <MDBCardTitle>Definition of Done</MDBCardTitle>
      <MDBCardText>
      <MDBBtn color="primary" size="sm" onClick={this.toggle}>+Add DOD</MDBBtn>
      {definitions.map(definition => (
        <MDBCard key={definition.id} className="card">
        <MDBCardBody>
        <MDBCardText>{definition.definition} <MDBBtn className="deleteTask" color="danger" size="sm" onClick={() => { if (window.confirm("Are you sure you want to delete this permantly?")) this.removeDOD(definition.id)} }>×</MDBBtn></MDBCardText>
        </MDBCardBody>
        </MDBCard>
      ))}
      </MDBCardText>
      </MDBCardBody>
      </MDBCard>
      </MDBContainer>
      <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
        <MDBModalHeader toggle={this.toggle}>Enter New Definition of Done</MDBModalHeader>
        <MDBModalBody>
          <MDBInput type="text" name="definition" label="Definition of Done" onChange={this.handleInput} background outline/>
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

export default DOD;