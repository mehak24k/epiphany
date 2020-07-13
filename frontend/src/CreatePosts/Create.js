import React, {Component} from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import { Redirect } from "react-router-dom";

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password:'',
      loggedIn: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('loggedIn');
    console.log(token);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async handleSubmit(event) {
    let loginData = {"email": this.state.email, "password": this.state.password}
    axios.post('http://localhost:5000/login', loginData)
    .then((response) => {
      //console.log(response.data.user_info[0].name);
      localStorage.setItem('userName', response.data.user_info[0].name);
      localStorage.setItem('userEmail', this.state.email);
      localStorage.setItem('userPoints', response.data.user_info[0].points);
      localStorage.setItem('loggedIn', true);
      this.setState({loggedIn: true});
      this.props.callback();
    }, (error) => {
      console.log('Looks like there was a problem: \n', error);
    });

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
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="formGroupEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name="email" placeholder="Enter email" email={this.state.email} onChange={this.handleChange} />
          </Form.Group>
            <Form.Group controlId="formGroupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" placeholder="Password" password={this.state.password} onChange={this.handleChange}/>
          </Form.Group>
          <Button variant="success" type="submit">Submit</Button>
        </Form>

      </Col>
    );
  }
}

export default Create;
