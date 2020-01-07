import React from 'react';
import { MDBContainer, MDBBtn, MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse, MDBNavItem, MDBNavLink, MDBIcon } from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';

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
    const bgPink = {backgroundColor: '#165fd9'}
    return(
      <div>
        <Router>
          <header>
            <MDBNavbar style={bgPink} dark expand="md" scrolling fixed="top">
              <MDBNavbarBrand href="/">
                  <strong>SCRUM BOARD (Beta)</strong>
              </MDBNavbarBrand>
              <MDBNavbarToggler onClick={ this.onClick } />
              <MDBCollapse isOpen = { this.state.collapse } navbar>
                <MDBNavbarNav right>
                  <MDBNavItem>
                    {
                      this.props.user
                        ? <MDBNavLink to="#" style={{margin:5}}>Hello, {this.props.user.displayName}</MDBNavLink>
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
        </Router>
      </div>
    );
  }
}

export default Navbar;