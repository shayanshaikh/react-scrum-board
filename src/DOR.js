import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBCardTitle } from "mdbreact";
import './index.css';
import firebaseApp from './firebaseApp';
import Modal from './Modal'

class DOR extends React.Component {
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

    const definitionsRef = firebaseApp.database().ref('dor');
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

    const itemRef = firebaseApp.database().ref(`/dor/${itemId}`);
    itemRef.update({definition: this.state.definition});

    this.edit_toggle();
  }

  componentDidMount() {
    const definitionsRef = firebaseApp.database().ref('dor');
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

  removeDOR(itemId) {
    const itemRef = firebaseApp.database().ref(`/dor/${itemId}`);
    itemRef.remove();
  }

  updateDOR(itemId) {
    const itemRef = firebaseApp.database().ref(`/dor/${itemId}`);
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
      <MDBCardTitle>Definitions of Ready</MDBCardTitle>
      <MDBBtn color="primary" size="sm" onClick={this.toggle} className="hvr-icon-pulse-grow"><i className="fas fa-plus hvr-icon"></i> New DOR</MDBBtn>
      { definitions.length === 0 ? <div className="emptyTitleM">Looks like you have no definitions of ready try creating a new one.</div> : null }
      {definitions.map(definition => (
        <MDBCard key={definition.id} className="card no-margins">
        <MDBCardBody>
        {definition.definition} 
        <MDBBtn className="editTask" color="indigo" size="sm" onClick={()=>{this.updateDOR(definition.id)}}><i className="fas fa-edit"></i></MDBBtn>
        <MDBBtn className="deleteTask" color="danger" size="sm" onClick={() => { if (window.confirm("Are you sure you want to delete this permantly?")) this.removeDOR(definition.id)} }>×</MDBBtn>
        </MDBCardBody>
        </MDBCard>
		  ))}
      </MDBCardBody>
      </MDBCard>
      </MDBContainer>
      <Modal
        title="Enter New Definition of Ready"
        button_title="Submit"
        modal_message="Here is where you will define the criteria that a user story must pass before it is ready to be put into production."
        input_name="definition"
        input_label="Definition of Ready"
        handleInput={this.handleInput}
        input_value={this.state.definition}
        toggle={this.toggle}
        modal={this.state.modal}
        handleSubmit={this.handleSubmit}
      />
      <Modal
        title="Editing Definition of Ready"
        button_title="Update"
        input_name="definition"
        input_label="Definition of Ready"
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

export default DOR;