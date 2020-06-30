import React, {Component, useContext} from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import { Redirect } from "react-router-dom";
import { UserContext } from '../Contexts/Context'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password:'',
      loggedIn: false,
    };

    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static contextType = UserContext

  componentDidMount() {
const { user, setUser } = this.context
    const newUser = { name: 'Joe', loggedIn: true }
    setUser(newUser)
    console.log(user.name) // { name: 'Tania', loggedIn: true }
  }

  handleChangeEmail(event) {
    this.setState({email: event.target.value});
  }

  handleChangePassword(event) {
    this.setState({password: event.target.value});
  }

  async handleSubmit(event) {
    const { user, setUser } = this.context

    let loginData = {"email": this.state.email, "password": this.state.password}
    console.log(loginData);

    //const { isAuthenticated } = useContext(AuthContext);

    const request = {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
       //'Content-Type': 'application/json',
       //'Access-Control-Allow-Headers': 'Content-Type,Authorization, DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range',
       //'Access-Control-Allow-Origin': '*'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(loginData)// body data type must match "Content-Type" header
    }
    //JSON.stringify(loginData)
    console.log(request.body);
    fetch('http://localhost:5000/login', request)
    .then((response) => {
      // Do stuff with the response
      //const { isAuthenticated } = useContext(AuthContext);
      if (response.status === 200) {
        const { user, setUser } = this.context
        this.setState({loggedIn: true});
        const newUser = { name: 'Tim', loggedIn: true }
        setUser(newUser)
        console.log(user.name)
      } else {
        this.setState({loggedIn: false});
        const newUser = { name: 'Tim', loggedIn: false }
        setUser(newUser)
      }
      let value = this.context
      console.log(value)
      return console.log('Code', response.status);
    })
    .catch((error) => {

      console.log('Looks like there was a problem: \n', error);
    });

    event.preventDefault();
  }

  render() {
    const redirectTo = this.state.loggedIn;
    if (redirectTo === true) {
        return (
          <Redirect to="/" />
        );
    }
    const { user, setUser } = this.context
    return (
      <Col md={{ span: "4", offset: "4" }}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="formGroupEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" email={this.state.email} onChange={this.handleChangeEmail} />
          </Form.Group>
            <Form.Group controlId="formGroupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" password={this.state.password} onChange={this.handleChangePassword}/>
          </Form.Group>
          <Button variant="success" type="submit">Submit</Button>
        </Form>
<p>{`Current User: ${user.name}`}</p>
      </Col>
    );
  }
}

export default Login;
