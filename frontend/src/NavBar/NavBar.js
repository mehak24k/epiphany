import React, { Component } from 'react';
import {Navbar, Nav } from 'react-bootstrap';

class NavBar extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark" fixed="top">
      <Navbar.Brand href="/">Epiphany!</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          {localStorage.getItem('loggedIn') !== "true" && <Nav.Link href="/login">Login</Nav.Link>}
          {localStorage.getItem('loggedIn') !== "true" && <Nav.Link href="/signup">Signup</Nav.Link>}
        </Nav>
        <Nav>
          {localStorage.getItem('loggedIn') === "true" && <Nav.Link href="/profile">Profile</Nav.Link>}
          {localStorage.getItem('loggedIn') === "true" && <Nav.Link href="/create">Post</Nav.Link>}
          {localStorage.getItem('loggedIn') === "true" && <Nav.Link onClick={this.props.callback}>Logout</Nav.Link>}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
      );
  }
}

export default NavBar;
