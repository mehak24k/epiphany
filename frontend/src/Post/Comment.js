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
  }

  updateComment(value) {
    this.setState({
      text: value,
    });
  }

  submit(event) {
    let postData = {"text": this.state.text, "user": localStorage.getItem("")}
    axios.post('https://epiphany-test-three.herokuapp.com/posts/${params.postId}/comment', postData)
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
    return (
        <Form onSubmit={this.submit}> 
          <Form.Group controlId="comment">
              <Form.Control as="textarea" name="comment" placeholder="Any comments?" onChange={this.updateComment} />
          </Form.Group>
          <Button variant="success" type="submit">Comment</Button>
        </Form>
    )
  }
}

export default Comment;
