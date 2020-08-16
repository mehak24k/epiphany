import React, {Component} from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import { Redirect, Link } from "react-router-dom";
import Alert from 'react-bootstrap/Alert'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password:'',
      loggedIn: false,
      errorMessage: '',
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
    if (this.state.email === '' || this.state.password === '') {
      this.setState({
        errorMessage: "Please fill in all fields."
      })
    } else {
      let loginData = {"email": this.state.email, "password": this.state.password}
      axios.post('http://localhost:5000/login', loginData)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          localStorage.setItem('userName', response.data.user_info[0].name);
          localStorage.setItem('userEmail', this.state.email);
          localStorage.setItem('userPoints', response.data.user_info[0].points);
          localStorage.setItem('loggedIn', true);
          this.setState({loggedIn: true});
          this.props.callback();
        } else {
          if (response.status === 206) {
            this.setState({
              errorMessage: "Please confirm your email before login."
            });
          } else {
            this.setState({
              errorMessage: "Invalid email or password. Please check your login details and try again."
            });
          }
        }
      }, (error) => {
        console.log('Looks like there was a problem: \n', error);
      });
    }

      event.preventDefault();
  }

  render() {
    const redirectTo = this.state.loggedIn;
    if (redirectTo) {
        return (
          <Redirect to="/" />
        );
    }
    return (
      <Col md={{ span: "4", offset: "4" }}>
      { this.state.errorMessage &&
        <Alert variant='danger'> { this.state.errorMessage } </Alert> }

        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="formGroupEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name="email" placeholder="Enter email" email={this.state.email} onChange={this.handleChange} />
          </Form.Group>
            <Form.Group controlId="formGroupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" placeholder="Password" password={this.state.password} onChange={this.handleChange}/>
          </Form.Group>
          <div>
            <Button variant="success" type="submit">Submit</Button>
            <Link to={`/signup`}><span className="float-right mt-2">I don't have an account.</span></Link>
          </div>
        </Form>

      </Col>
    );
  }
}

export default Login;
