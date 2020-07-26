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
import Alert from 'react-bootstrap/Alert'
import photo from '../Files/photo.jpg'
import thumbsup from '../Files/thumbsup.png'
import thumbsdown from '../Files/thumbsdown.png'
import heart from '../Files/heart.png'
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed'
import bubblesort from "../Files/bubblesort.mp4"


class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
      text:'',
      postId: 0,
      deleted: false,
      commented: false,
      upvoted: false,
      downvoted: false,
      errorMessage: '',
    };
    this.submit = this.submit.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.upvote = this.upvote.bind(this);
    this.downvote = this.downvote.bind(this);
  }

  async componentDidMount() {
    const { match: { params } } = this.props;
    if (localStorage.getItem("loggedIn") === "true") {
      let loginData = {"email": localStorage.getItem("userEmail")}
      axios.post(`http://localhost:5000/posts/${params.postId}`, loginData)
      .then((response) => {
        console.log(response.data.data[0].liked);
        this.setState({
          upvoted: response.data.data[0].liked,
          downvoted: response.data.data[0].disliked,
        });
      }, (error) => {
        console.log('Looks like there was a problem: \n', error);
      });
    }
    this.refreshPost()
  }

  async refreshPost() {
    const { match: { params } } = this.props;
    const post = (await axios.get(`http://localhost:5000/posts/${params.postId}`)).data;
    this.setState({
      post: post.json_post,
      postId: params.postId,
      commented: false,
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
    axios.post(`http://localhost:5000/posts/${params.postId}/comment`, postData)
    .then((response) => {
      console.log(response);
      this.setState({
        commented: true,
      })
      this.refreshPost();
    }, (error) => {
      console.log('Looks like there was a problem: \n', error);
    });
    event.preventDefault();
  }

  async deletePost() {
    const { match: { params } } = this.props;
    let postData = {"text": this.state.text, "user_email": localStorage.getItem('userEmail'), "post_id": params.postId}
    console.log(postData);
    axios.post(`http://localhost:5000/posts/${params.postId}/delete`, postData)
    .then((response) => {
      console.log(response);
      this.setState({
        deleted: true,
      })
      this.refreshPost();
    }, (error) => {
      console.log('Looks like there was a problem: \n', error);
    });
  }

  async upvote(event) {
    const { match: { params } } = this.props;
    let postData = {"user_email": localStorage.getItem('userEmail'), "post_id": params.postId}
    console.log(postData);
    axios.post(`http://localhost:5000/posts/${params.postId}/upvote`, postData)
    .then((response) => {
      console.log(response);
      if (this.state.upvoted === true) {
        this.setState({
          upvoted: false,
        })
      } else {
        this.setState({
          upvoted: true,
        })
      }
        this.refreshPost();
    }, (error) => {
      console.log('Looks like there was a problem: \n', error);
    });
    event.preventDefault();
  }

  async downvote(event) {
    const { match: { params } } = this.props;
    let postData = {"user_email": localStorage.getItem('userEmail'), "post_id": params.postId}
    console.log(postData);
    axios.post(`http://localhost:5000/posts/${params.postId}/downvote`, postData)
    .then((response) => {
      console.log(response);
      if (this.state.downvoted === true) {
        this.setState({
          downvoted: false,
        })
      } else {
        this.setState({
          downvoted: true,
        })
      }
        this.refreshPost();
      }, (error) => {
      console.log('Looks like there was a problem: \n', error);
    });
    event.preventDefault();
  }

  render() {
    const {post} = this.state;
    if (post === null) return <p>Loading ...</p>;
    var text = post.body
    console.log(post.tags);
    return (
      <div className="container">
        <div className="row">
          <div className="jumbotron col-12">
          { this.state.errorMessage &&
            <Alert variant='danger'> { this.state.errorMessage } </Alert> }
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
            {!post.is_file &&
              <p className="lead">
                  {text.split("\n").map((i,key) => {
                      return <div key={key}>{i}</div>;
                  })}
              </p>
            }
            {post.is_file &&
              <div id="theVideo">
              <ResponsiveEmbed aspectRatio="16by9">
                  <video id="samp" width="640" height="480" controls>
                      <source src={bubblesort} type="video/mp4">
                      </source>
                      Your browser does not support this video format.
                  </video>
              </ResponsiveEmbed>
              </div>
            }
              <Row>
              <Col>
              <h2> {post.upvotes} <img src={heart} style={{height: 30, width: 30}}></img> </h2>
              </Col>
              <Col md={{ offset: "7" }}>

              {(localStorage.getItem('loggedIn') === "true" && localStorage.getItem('userEmail') !== post.user_email) &&
              <div>
              <Row>
              <Col md={{ offset: "5" }}>
              {this.state.downvoted &&
                <Button disabled>
                  <img src={thumbsup} style={{height: 30, width: 30}}></img>
                </Button>
              }
              {!this.state.downvoted &&
                <Button onClick={this.upvote}>
                  <img src={thumbsup} style={{height: 30, width: 30}}></img>
                </Button>
              }
              </Col>
              <Col>
              {this.state.upvoted &&
                <Button disabled>
                  <img src={thumbsdown} style={{height: 30, width: 30}}></img>
                </Button>
              }
              {!this.state.upvoted &&
                <Button onClick={this.downvote}>
                  <img src={thumbsdown} style={{height: 30, width: 30}}></img>
                </Button>
              }
              </Col>
              </Row>
              </div>
            }
              </Col>
              </Row>
              <Row>
              {(localStorage.getItem('loggedIn') === "true" && localStorage.getItem('userEmail') === post.user_email) &&
              <Col>
              <Link to={`${post.id}/update`}><Button variant="outline-success">Update</Button></Link>
              <Button variant="outline-danger" onClick={() => {this.deletePost()}}>Delete</Button>
              </Col>
            }
              </Row>
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
