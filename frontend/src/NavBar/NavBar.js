import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container'


class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Navbar collapseOnSelect expand="lg" bg="success" variant="light" fixed="top">
          <Navbar.Brand href="/">Epiphany!</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              {localStorage.getItem('loggedIn') !== "true" && <Nav.Link href="/login">Login</Nav.Link>}
              {localStorage.getItem('loggedIn') !== "true" && <Nav.Link href="/signup">Signup</Nav.Link>}
              {localStorage.getItem('loggedIn') === "true" && <Nav.Link href="/profile">Profile</Nav.Link>}
              <NavDropdown title="Posts" id="collasible-nav-dropdown">
                {localStorage.getItem('loggedIn') === "true" && <NavDropdown.Item href="/create">Make a Post</NavDropdown.Item>}
                {localStorage.getItem('loggedIn') === "true" && <NavDropdown.Item href="/fav">Followed Posts</NavDropdown.Item>}
                <NavDropdown.Item href="/all-time">All Posts by Time</NavDropdown.Item>
                <NavDropdown.Item href="/all-votes">All Posts by Votes</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              {localStorage.getItem('loggedIn') === "true" && <Nav.Link onClick={this.props.callback}>Logout</Nav.Link>}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
      );
  }
}

export default NavBar;
