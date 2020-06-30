import React, { useContext, Component } from 'react';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';
import { UserProvider } from '../Contexts/Context'
import { UserContext } from '../Contexts/Context'

class NavBar extends Component {
  static contextType = UserContext

  render() {
    const { user, setUser } = this.context
    return (
    <UserProvider value={user}>
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark" fixed="top">
    <Navbar.Brand href="/">Epiphany!</Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
      {!user.loggedIn && <Nav.Link href="/login">Login</Nav.Link>}

        <Nav.Link href="/signup">Signup</Nav.Link>
      </Nav>
      <Nav>
        <Nav.Link href="#deets">More deets</Nav.Link>
        <Nav.Link href="#deets2">{`Current User: ${user.name}`}</Nav.Link>
        <Nav.Link eventKey={2} href="#memes">
          Dank memes
        </Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
  </UserProvider>
    );
}

}


export default NavBar;
