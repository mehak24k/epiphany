import React, {Component} from 'react';
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
    };
    this.submit = this.submit.bind(this);
    this.updateComment = this.updateComment.bind(this);

  }

  async componentDidMount() {
    const { match: { params } } = this.props;
    const post = (await axios.get(`http://localhost:5000/posts/${params.postId}`)).data;
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
    axios.post(`http://localhost:5000/posts/${params.postId}/comment`, postData)
    .then((response) => {
      console.log(response);
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
            <p>Content:</p>
              <p className="lead">
                  {text.split("\n").map((i,key) => {
                      return <div key={key}>{i}</div>;
                  })}
              </p>
              {localStorage.getItem('loggedIn') === "true" && <Button variant="outline-success">Update</Button>}
              {localStorage.getItem('loggedIn') === "true" && <Button variant="outline-danger">Delete</Button>}
            <hr className="my-4" />
            <Comment postId={post.id} submitComment={this.submitComment}/>
            <hr className="my-4" />
                {
                  post.comments.map(comment => (
                    comment.comment_level === 1 ? 
                          <Media className="mt-1">
                            <Media.Body>
                              <h5>{ comment.commentor }</h5>
                              <p>
                                { comment.text.split("\n").map((i,key) => {
                                  return <div key={key}>{i}</div>;
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
                                            return <div key={key}>{i}</div>;
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
                                            return <div key={key}>{i}</div>;
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
