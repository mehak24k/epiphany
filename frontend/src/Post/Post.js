  
import React, {Component, useState} from 'react';
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
import Collapse from 'react-bootstrap/Collapse'

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
      text: '',
      postId: 0,
      deleted: false,
      commented: false,
      reply: '',
      replied: false,
      c_deleted: false,
    };
    this.submit = this.submit.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.replyTo = this.replyTo.bind(this);
    this.Reply = this.Reply.bind(this);
  }

  async componentDidMount() {
    this.refreshPost();
  }
  async refreshPost() {
    const { match: { params } } = this.props;
    const post = (await axios.get(`https://epiphany-test-three.herokuapp.com/posts/${params.postId}`)).data;
    this.setState({
      post: post.json_post,
      postId: params.postId,
      deleted: false,
      commented: false,
      text: '',
      reply: '',
      replied: false,
      c_deleted: false,
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
      this.setState({
        commented: true,
      })
    }, (error) => {
      console.log('Looks like there was a problem: \n', error);
    });
    event.preventDefault();
  }

  async deletePost() {
    const { match: { params } } = this.props;
    axios.post(`http://epiphany-test-three.herokuapp.com/posts/${params.postId}/delete`)
    .then((response) => {
      this.setState({
        deleted: true,
      })
    }, (error) => {
      console.log('Looks like there was a problem: \n', error);
    });
  }

  async deleteComment(event, id) {
    const { match: { params } } = this.props;
    axios.post(`http://localhost:5000/posts/${params.postId}/${id}/delete`)
    .then((response) => {
      console.log(response);
      this.setState({
        c_deleted: true,
      })
    }, (error) => {
      console.log('Looks like there was a problem: \n', error);
    });
    event.preventDefault();
  }

  async replyTo(event, id) {
    const { match: { params } } = this.props;
    let postData = {"text": this.state.reply, "user_email": localStorage.getItem('userEmail'), "post_id": params.postId, "parent_id": id}
    axios.post(`http://localhost:5000/posts/${params.postId}/${id}/reply`, postData)
    .then((response) => {
      this.setState({
        replied: true,
      })
    }, (error) => {
      console.log('Looks like there was a problem: \n', error);
    });
    event.preventDefault();
  }

  Reply = (props) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="link"
          onClick={() => setOpen(!open)}
          aria-controls="example-collapse-text"
          aria-expanded={open}
          size="sm"
        >
        Reply
        </Button>
        <Collapse in={open}>
          <div className="mt-1">
            <Form onSubmit={(e) => this.replyTo(e, props.id)}>
                <Form.Group controlId="text">
                    <Form.Control as="textarea" name="reply" placeholder="Reply here!" reply={this.state.reply} onChange={this.updateComment} />
                </Form.Group>
                <Button variant="success" type="submit" size="sm">Reply</Button>
            </Form>
          </div>
        </Collapse>
      </>
    );
  }

  Delete = (props) => {
    return  (
      <Button 
        variant="link" 
        size="sm"
        onClick={(e) => this.deleteComment(e, props.id)}
      >
        Delete
      </Button>
    );
  }

  render() {
    // checking for deleted post
    const deleted = this.state.deleted;
    const commented = this.state.commented;
    const replied = this.state.replied;
    const c_deleted = this.state.c_deleted;
    if (deleted) {
      return (
        <Redirect to="/" />
      );
    }
    if (commented || replied || c_deleted) {
      this.refreshPost();
    }
    const {post} = this.state;
    if (post === null) 
      return <p>
        Loading ...
        </p>;
    var text = post.body
    return (
      <div className="container">
        <div className="row">
          <div className="jumbotron col-12">
            <h1 className="display-3">{post.title}</h1>
            <Row className="ml-1">
            {post.tags && post.tags.map(tag => (
              <Col style={{ paddingLeft: 2, paddingRight: 2 }} md="auto">
                <h4>
                <Badge variant="info">{tag.name}</Badge>
                </h4>
              </Col>
              ))
            }
            </Row>
            <Row className="ml-1">
              Posted by&nbsp;<Link to={`/users/${post.user_id}`}>{ post.username }</Link>&nbsp;at { post.time }
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
                                <p><small> 
                                  { comment.commentor !== "deleted" && comment.time }
                                  {
                                    (localStorage.getItem('loggedIn') === "true" && localStorage.getItem('userEmail') === comment.user_email) 
                                    && <this.Delete id={ comment.comment_id }/>
                                  }
                                  { comment.commentor !== "deleted" && <this.Reply id={ comment.comment_id }/> }
                                </small></p>
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
                                      <p><small>{ comment.commentor !== "deleted" && comment.time }
                                        {
                                          (localStorage.getItem('loggedIn') === "true" && localStorage.getItem('userEmail') === comment.user_email) 
                                          && <this.Delete id={ comment.comment_id }/>
                                        }
                                        { comment.commentor !== "deleted" && <this.Reply id={ comment.comment_id }/> }
                                      </small></p>
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
                                        <p><small>
                                          { comment.commentor !== "deleted" && comment.time }
                                          {
                                            (localStorage.getItem('loggedIn') === "true" && localStorage.getItem('userEmail') === comment.user_email) 
                                            && <this.Delete id={ comment.comment_id }/>
                                          }
                                          { comment.commentor !== "deleted" && <this.Reply id={ comment.comment_id }/> } 
                                        </small></p>
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