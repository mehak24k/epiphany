import React, {Component, useState} from 'react';
import { Redirect } from 'react-router-dom';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Media from 'react-bootstrap/Media'
import Form from 'react-bootstrap/Form'
import Collapse from 'react-bootstrap/Collapse'
import Alert from 'react-bootstrap/Alert'
import photo from '../Files/photo.jpg'
import heart from '../Files/heart.png'
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed'
import bubblesort from "../Files/bubblesort.mp4"
import { IoIosArrowDropup } from "react-icons/io";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import Spinner from 'react-bootstrap/Spinner'



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
    this.replyTo = this.replyTo.bind(this);
    this.Reply = this.Reply.bind(this);
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
      deleted: false,
      commented: false,
      text: '',
      reply: '',
      replied: false,
      c_deleted: false,
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
    let postData = {"text": this.state.text, "user_email": localStorage.getItem('userEmail'), "post_id": params.postId};
    console.log(postData);
    axios.post(`http://localhost:5000/posts/${params.postId}/comment`, postData)
    .then((response) => {
      this.setState({
        commented: true,
      })
      console.log(response);
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
      this.setState({
        deleted: true,
      })
      this.refreshPost();
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
  async upvote(event) {
    const { match: { params } } = this.props;
    let postData = {"user_email": localStorage.getItem('userEmail'), "post_id": params.postId}
    console.log(postData);
    axios.post(`http://localhost:5000/posts/${params.postId}/upvote`, postData)
    .then((response) => {
      console.log(response);
      if (this.state.upvoted) {
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

  async downvote(event) {
    const { match: { params } } = this.props;
    let postData = {"user_email": localStorage.getItem('userEmail'), "post_id": params.postId}
    console.log(postData);
    axios.post(`http://localhost:5000/posts/${params.postId}/downvote`, postData)
    .then((response) => {
      console.log(response);
      if (this.state.downvoted) {
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
  
  commentBox = () => {
    if (localStorage.getItem('loggedIn') === "true") {
      return (
        <Form onSubmit={this.submit}>
          <Form.Group controlId="text">
              <Form.Control as="textarea" name="text" placeholder="Any comments?" text={this.state.text} onChange={this.updateComment} />
          </Form.Group>
          <Button variant="success" type="submit">Comment</Button>
        </Form>
      );
    } else {
      return (
        <Form onSubmit={this.submit}>
          <Form.Group controlId="text">
              <Form.Control as="textarea" name="text" placeholder="Login to begin commenting!" text={this.state.text} onChange={this.updateComment} />
          </Form.Group>
          <Button variant="success" disabled>Comment</Button>
        </Form>
      );
    }
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
    if (post === null) {
      return (<Col><Spinner animation="border" variant="primary" /> <p>Loading ...</p></Col>);
    } 
    var text = post.body
    return (
      <div className="container">
            {post === null && <p>Loading ...</p>}
        <div className="row">
          <div className="jumbotron col-12">
          { this.state.errorMessage &&
            <Alert variant='danger'> { this.state.errorMessage } </Alert> }
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
                      <ButtonGroup>
                        <Button variant="light" disabled>
                          <IoIosArrowDropup style={{width: 30, height: 30}}/>
                        </Button>
                        <Button variant="light" onClick={this.downvote}>
                          <IoIosArrowDropdownCircle style={{width: 30, height: 30}}/>
                        </Button>
                      </ButtonGroup>
                    }
                    {this.state.upvoted &&
                      <ButtonGroup>
                        <Button variant="light" onClick={this.upvote}>
                          <IoIosArrowDropupCircle style={{width: 30, height: 30}}/>
                        </Button>
                        <Button variant="light" disabled>
                          <IoIosArrowDropdown style={{width: 30, height: 30}}/>
                        </Button>
                      </ButtonGroup>
                    }
                    {!this.state.downvoted && !this.state.upvoted && 
                      <ButtonGroup>
                        <Button variant="light" onClick={this.upvote}>
                          <IoIosArrowDropup style={{width: 30, height: 30}}/>
                        </Button>
                        <Button variant="light" onClick={this.downvote}>
                          <IoIosArrowDropdown style={{width: 30, height: 30}}/>
                        </Button>
                      </ButtonGroup>
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
              <this.commentBox />
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
