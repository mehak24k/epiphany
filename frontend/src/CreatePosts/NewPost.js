import React, {Component} from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import { Redirect } from "react-router-dom";

class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body:'',
      posted: false,
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
    let postData = {"title": this.state.title, "body": this.state.body, "user": localStorage.getItem("userEmail")}
    axios.post('https://epiphany-test-three.herokuapp.com/create', postData)
    .then((response) => {
      console.log(response);
      this.setState({
        posted: true,
      })
    }, (error) => {
      console.log('Looks like there was a problem: \n', error);
    });
      event.preventDefault();
  }

  render() {
    const redirectTo = this.state.posted;
    if (redirectTo) {
        return (
          <Redirect to="/" />
        );
    }
    return (
      <Col style={{paddingLeft: 200, paddingRight: 200}}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="formGroupTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" placeholder="Enter title" title={this.state.title} onChange={this.handleChange} />
          </Form.Group>
            <Form.Group controlId="formGroupPassword">
              <Form.Label>Body</Form.Label>
              <Form.Control as="textarea" rows="15" name="body" placeholder="Body" password={this.state.body} onChange={this.handleChange}/>
          </Form.Group>
          <Button variant="success" type="submit">Submit</Button>
        </Form>
      </Col>
    );
  }
}

export default NewPost;
