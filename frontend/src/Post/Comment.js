// irrelevant right now

import React, {Component, Fragment} from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
    this.submit = this.submit.bind(this);
    this.updateComment = this.updateComment.bind(this);
  }

  updateComment(value) {
    this.setState({
        text: value,
    });
  }

  async submit(event) {
    const { match: { params } } = this.props;
    let postData = {"text": this.state.text, "user_email": localStorage.getItem('userEmail'), "post_id": params.postId}
    console.log(postData);
    axios.post(`https://epiphany-test-three.herokuapp.com/posts/${params.postId}/comment`, postData)
    .then((response) => {
      console.log(response);
    }, (error) => {
      console.log('Looks like there was a problem: \n', error);
    });
      event.preventDefault();
  }

  render() {
    return (
        <Form onSubmit={this.submit}>
          <Form.Group controlId="text">
              <Form.Control as="textarea" name="text" placeholder="Any comments?" text={this.state.text} onChange={this.updateComment} />
          </Form.Group>
          <Button variant="success" type="submit">Comment</Button>
        </Form>
    )
  }
}

export default Comment;
