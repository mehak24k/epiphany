import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Comment from './Comment'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Media from 'react-bootstrap/Media'
import Form from 'react-bootstrap/Form'

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
      text:'',
      deleted: false,
    };
    this.submit = this.submit.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  async componentDidMount() {
    this.refreshPost();
  }

  async refreshPost() {
    const { match: { params } } = this.props;
    const post = (await axios.get(`https://epiphany-test-three.herokuapp.com/posts/${params.postId}`)).data;
    this.setState({
      post: post.json_post,
    });
  }

  updateComment(event) {
    this.setState({
        [event.target.name]: event.target.value
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

  async deletePost() {
    const { match: { params } } = this.props;
    let postData = {"text": this.state.text, "user_email": localStorage.getItem('userEmail'), "post_id": params.postId}
    console.log(postData);
    axios.post(`https://epiphany-test-three.herokuapp.com/posts/${params.postId}/delete`, postData)
    .then((response) => {
      console.log(response);
      this.setState({
        deleted: true,
      })
    }, (error) => {
      console.log('Looks like there was a problem: \n', error);
    });
  }

  render() {
    const deleted = this.state.deleted;
    if (deleted) {
      return (
        <Redirect to="/" />
      );
    }
    const {post} = this.state;
    if (post === null) return <p>Loading ...</p>;
    var text = post.body
    console.log(post.tags);
    return (
      <div className="container">
        <div className="row">
          <div className="jumbotron col-12">
            <h1 className="display-3">{post.title}</h1>
            <Row>
            {post.tags && post.tags.map(tag => (
              <Col style={{ paddingLeft: 2, paddingRight: 2 }} md="auto">
                <h4>
                <Badge variant="info">{tag.name}</Badge>
                </h4>
              </Col>
              ))
            }
            </Row>
            <hr className="my-4" />
              <p className="lead">
                  {text.split("\n").map((i,key) => {
                      return <div key={key}>{i}</div>;
                  })}
              </p>
              {(localStorage.getItem('loggedIn') === "true" && localStorage.getItem('userEmail') === post.user_email) && <Link to={`${post.id}/update`}><Button variant="outline-success">Update</Button></Link>}
              {(localStorage.getItem('loggedIn') === "true" && localStorage.getItem('userEmail') === post.user_email) && <Button variant="outline-danger" onClick={() => {this.deletePost()}}>Delete</Button>}
            <hr className="my-4" />

            <Form onSubmit={this.submit}>
              <Form.Group controlId="text">
                  <Form.Control as="textarea" name="text" placeholder="Any comments?" text={this.state.text} onChange={this.updateComment} />
              </Form.Group>
              <Button variant="success" type="submit">Comment</Button>
            </Form>

            <hr className="my-4" />
                {
                  post.comments.map(comment => (
                    comment.comment_level === 1 ?
                          <Media className="mt-1">
                            <Media.Body>
                              <h5>{ comment.commentor }</h5>
                              <p>
                                { comment.text.split("\n").map((i,key) => {
                                  return <div key={key}>
                                    {i}
                                    <p><small>reply · { comment.time }</small></p>
                                    </div>;
                                }) }
                              </p>
                            </Media.Body>
                          </Media>
                    : comment.comment_level === 2 ?
                        <Media className="ml-3">
                          <Media.Body>
                            <h5>{ comment.commentor }</h5>
                              <p>
                                { comment.text.split("\n").map((i,key) => {
                                    return <div key={key}>
                                      {i}
                                      <p><small>reply · { comment.time }</small></p>
                                    </div>;
                                }) }
                              </p>
                          </Media.Body>
                        </Media>
                        :
                          <Media className="ml-5">
                            <Media.Body>
                              <h5>{ comment.commentor }</h5>
                                <p>
                                  { comment.text.split("\n").map((i,key) => {
                                      return <div key={key}>
                                        {i}
                                        <p><small>reply · { comment.time }</small></p>
                                      </div>;
                                  }) }
                                </p>
                            </Media.Body>
                          </Media>
                  ))
                }
          </div>
        </div>
      </div>
    )
  }
}

export default Post;
