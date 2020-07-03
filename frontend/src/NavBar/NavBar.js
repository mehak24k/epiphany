import React, { useContext, Component } from 'react';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';

class NavBar extends Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.state = {
      loggedIn: false,
    }
  }

  // Add a logout method

  logout() {
    localStorage.clear();
    sessionStorage.setItem('loggedIn', false);
    this.setState({loggedIn: false});
  }


  update() {
    sessionStorage.clear();
    this.setState({loggedIn: false});
  }

  render() {
    return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark" fixed="top">
    <Navbar.Brand href="/">Epiphany!</Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
        {sessionStorage.getItem('loggedIn') != "true" && <Nav.Link href="/login">Login</Nav.Link>}
        <Nav.Link href="/signup">Signup</Nav.Link>
      </Nav>
      <Nav>
        <Nav.Link href="#deets">More deets</Nav.Link>
        <button onClick={this.props.callback}>Logout</button>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
    );
}

}

export default NavBar;
