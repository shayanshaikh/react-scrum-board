import React from 'react';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from "mdbreact";
import './index.css';
import firebaseApp from './firebaseApp';

class Modal extends React.Component {
   constructor(props) {
     super(props)
   }
  
  render() {
  return ( 
    <MDBModal isOpen={this.props.modal} toggle={this.props.toggle} centered scrollable>
      <MDBModalHeader toggle={this.props.toggle}>{this.props.title}</MDBModalHeader>
      <MDBModalBody>
        {this.props.modal_message}
        <MDBInput type="text" name={this.props.input_name} value={this.props.input_value} label={this.props.input_label} onChange={this.props.handleInput} background outline/>
        {this.props.second_input == true ? <MDBInput type="text" name={this.props.input_name2} value={this.props.input_value2} label={this.props.input_label2} onChange={this.props.handleInput} background outline/> : null }
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn color="secondary" onClick={this.props.toggle}>Close</MDBBtn>
        {this.props.status == "edit" ?
        <MDBBtn color="primary" onClick=
                {() => this.props.handleEdit(this.props.edit_id)}>{this.props.button_title}</MDBBtn> :
        <MDBBtn color="primary" onClick={(e) => this.props.handleSubmit(e)}>{this.props.button_title}</MDBBtn> }
      </MDBModalFooter>
    </MDBModal>
    );
  }
}

export default Modal;