import React from 'react';
import { MDBBtn, MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse, MDBNavItem, MDBNavLink } from 'mdbreact';
import './index.css';
import logo from './assets/logo.svg';

class Navbar extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          collapse: false,
      };
      this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({
        collapse: !this.state.collapse,
      });
  }

  render() {
    return(
      <header>
        <MDBNavbar className="navbar" dark expand="md" scrolling fixed="top">
          <MDBNavbarBrand href="/">
              <img src={logo} className="contain" alt="" /><strong>(Beta)</strong>
          </MDBNavbarBrand>
          <MDBNavbarToggler onClick={ this.onClick } />
          <MDBCollapse isOpen = { this.state.collapse } navbar>
            <MDBNavbarNav right>
              <MDBNavItem>
                <MDBNavLink to="/" style={{margin:5}}>Home</MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink to="/dashboard" style={{margin:5}}><i className="fas fa-tachometer-alt"></i>Dashboard</MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                {
                  this.props.user
                    ? <MDBNavLink to="/" style={{margin:5}}>Hello, {this.props.user.displayName}</MDBNavLink>
                    : <MDBNavLink to="#"></MDBNavLink>
                }             
              </MDBNavItem>
              <MDBNavItem>
                {
                  this.props.user
                    ? <MDBBtn size="md" color="danger" onClick={this.props.signOut}>Sign out</MDBBtn>
                    : this.props.signUp //<MDBBtn size="md" onClick={this.props.signInWithGoogle}>Log in</MDBBtn>
                }
              </MDBNavItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBNavbar>
      </header>
    );
  }
}

export default Navbar;