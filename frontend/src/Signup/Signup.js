import React, {Component} from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Redirect, Link } from "react-router-dom";
import Alert from 'react-bootstrap/Alert'

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password:'',
      errorMessage: '',
      signedUp: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async handleSubmit(event) {
    if (this.state.username === '' || this.state.email === '' || this.state.password === '') {
      this.setState({
        errorMessage: "Please fill in all fields."
      })
    } else {
      let signupData = {"name": this.state.username, "email": this.state.email, "password": this.state.password}
      console.log(signupData)
      axios.post('http://localhost:5000/signup', signupData)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          this.setState({signedUp: true});
        } else if (response.status === 206) {
          this.setState({
            errorMessage: "This email has already been registered. Please confirm your email through the confirmation link sent via email."
          })
        }
      }, (error) => {
        console.log('Looks like there was a problem: \n', error);
      });
    }

    event.preventDefault();
  }

  render() {
    const redirectTo = this.state.signedUp;
    if (redirectTo) {
        return (
          <Redirect to="/email_sent" />
        );
    }
    return (
      <Col md={{ span: "4", offset: "4" }}>
      { this.state.errorMessage &&
        <Alert variant='danger'> { this.state.errorMessage } </Alert> }

        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="formGroupUsername">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="username" placeholder="Enter name" username={this.state.username} onChange={this.handleChange} />
          </Form.Group>
          <Form.Group controlId="formGroupEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name="email" placeholder="Enter email" email={this.state.email} onChange={this.handleChange} />
          </Form.Group>
            <Form.Group controlId="formGroupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" placeholder="Password" password={this.state.password} onChange={this.handleChange}/>
          </Form.Group>
          <div>
            <Button variant="success" type="submit">Signup</Button>
            <Link to={`/login`}><span className="float-right mt-2">I already have an account.</span></Link>
          </div>
        </Form>
      </Col>
    );
  }
}

export default Signup;
