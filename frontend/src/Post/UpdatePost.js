import React, {Component} from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import { Redirect } from "react-router-dom";

class UpdatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body:'',
      updated: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const { match: { params } } = this.props;
    console.log(post.json_post.body);
    const post = (await axios.get(`https://whispering-oasis-25381.herokuapp.com/posts/${params.postId}/update`)).data;
    this.setState({
      title: post.json_post.title,
      body: post.json_post.body
    });

  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async handleSubmit(event) {
    const { match: { params } } = this.props;
    let postData = {"title": this.state.title, "body": this.state.body, "user": localStorage.getItem("userEmail")}
    axios.post(`https://whispering-oasis-25381.herokuapp.com/posts/${params.postId}/update`, postData)
    .then((response) => {
      console.log(response);
      this.setState({
        updated: true,
      })
    }, (error) => {
      console.log('Looks like there was a problem: \n', error);
    });
      event.preventDefault();
  }

  render() {
    const redirectTo = this.state.updated;
    const { match: { params } } = this.props;
    if (redirectTo) {
        return (
          <Redirect to={`/post/${params.postId}`} />
        );
    }
    return (
      <Col style={{paddingLeft: 200, paddingRight: 200}}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="formGroupTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={this.state.title} onChange={this.handleChange} />
          </Form.Group>
            <Form.Group controlId="formGroupPassword">
              <Form.Label>Body</Form.Label>
              <Form.Control as="textarea" rows="15" name="body" value={this.state.body} onChange={this.handleChange}/>
          </Form.Group>
          <Button variant="success" type="submit">Submit</Button>
        </Form>
      </Col>
    );
  }
}



export default UpdatePost;
