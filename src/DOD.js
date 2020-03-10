import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from "mdbreact";
import './index.css';
import firebaseApp from './firebaseApp';
import Modal from './Modal'

class DOD extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      definition: '',
      definitions: [],
      edit_modal: false,
      edit_id: ''
    }
  }
    

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  edit_toggle = () => {
    this.setState({
      edit_modal: !this.state.edit_modal,
      definition: ''
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

  handleEdit = (itemId) => {
    if (!this.state.definition.length) {
      return;
    }

    const itemRef = firebaseApp.database().ref(`/dod/${itemId}`);
    itemRef.update({definition: this.state.definition});

    this.edit_toggle();
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

  updateDOD(itemId) {
    const itemRef = firebaseApp.database().ref(`/dod/${itemId}`);
    itemRef.on('value', (snapshot) => {
      if (snapshot && snapshot.exists()) {
        let definition = snapshot.val();
        this.setState({
          definition: definition.definition,
          edit_id: itemId,
          edit_modal: !this.state.edit_modal
        });
      }
    });
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
      <MDBCardTitle>Definitions of Done</MDBCardTitle>
      <MDBBtn color="primary" size="sm" onClick={this.toggle} className="hvr-icon-pulse-grow"><i className="fas fa-plus hvr-icon"></i> New DOD</MDBBtn>
      { definitions.length === 0 ? <div className="emptyTitleM">Looks like you have no definitions of done try creating a new one.</div> : null }
      {definitions.map(definition => (
        <MDBCard key={definition.id} className="card">
        <MDBCardBody>
        {definition.definition} 
        <MDBBtn className="editTask" color="indigo" size="sm" onClick={()=>{this.updateDOD(definition.id)}}><i className="fas fa-edit"></i></MDBBtn>
        <MDBBtn className="deleteTask" color="danger" size="sm" onClick={() => { if (window.confirm("Are you sure you want to delete this permantly?")) this.removeDOD(definition.id)} }>×</MDBBtn>
        </MDBCardBody>
        </MDBCard>
      ))}
      </MDBCardBody>
      </MDBCard>
      </MDBContainer>
      <Modal
        title="Enter New Definition of Done"
        button_title="Submit"
        modal_message="Here is where you will define the general criteria that makes a user story or final product ready to be delivered."
        input_name="definition"
        input_label="Definition of Done"
        handleInput={this.handleInput}
        input_value={this.state.definition}
        toggle={this.toggle}
        modal={this.state.modal}
        handleSubmit={this.handleSubmit}
      />
      <Modal
        title="Editing Definition of Done"
        button_title="Update"
        input_name="definition"
        input_label="Definition of Done"
        handleInput={this.handleInput}
        input_value={this.state.definition}
        toggle={this.edit_toggle}
        modal={this.state.edit_modal}
        handleEdit={this.handleEdit}
        status="edit"
        edit_id={this.state.edit_id}
      />
    </React.Fragment>
    );
  }
}

export default DOD;