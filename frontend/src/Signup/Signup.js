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
    
    var password = this.state.password;
    var i=0;
    var character='';
    var containsNumber = false;
    var containsCapital = false;
    while (i <= password.length){
        character = password.charAt(i);
        if (!isNaN(character * 1)){
            containsNumber = true;
        }else{
            if (character == character.toUpperCase()) {
                containsCapital = true;
            }
        }
        i++;
    }

    var acceptList = [ "student.institute.edu" , "staff.institute.edu" ];
    var isStudent = false;
    var isStaff = false;
    var emailValue = this.state.email;
    var splitArray = emailValue.split('@'); // To Get Array

    
    if (acceptList.indexOf(splitArray[1]) == 0) {
      // Means it has the accepted domains
      isStudent = true;
      alert("is a student!");
    }
    if (acceptList.indexOf(splitArray[1]) == 1) {
      alert("is a staff!");
      isStaff = true;
    }

    if (this.state.username === '' || this.state.email === '' || this.state.password === '') {
      this.setState({
        errorMessage: "Please fill in all fields."
      })
      
    } else if (!containsNumber || !containsCapital || this.state.password.length < 8) {
      this.setState({
        errorMessage: "Password must be at least 8 characters long, contain a capital letter and a number."
      }) 
    } else if (!isStudent && !isStaff) {
      this.setState({
        errorMessage: "Please signup with your institute email address."
      })
    } else {
      let signupData = {"name": this.state.username, "email": this.state.email, "password": this.state.password, "isStudent": isStudent, "isStaff": isStaff}
      console.log(signupData)
      axios.post('https://epiphany-test-three.herokuapp.com/signup', signupData)
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
