import React, {Component} from 'react';
import axios from 'axios';
import Comment from './Comment'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
    };

    this.submitComment = this.submitComment.bind(this);
  }

  async componentDidMount() {
    const { match: { params } } = this.props;
    const post = (await axios.get(`http://localhost:5000/posts/${params.postId}`)).data;
    this.setState({
      post: post.json_post,
    });
  }

  async refreshPage() {
    const { match: { params } } = this.props;
    const post = (await axios.get(`http://localhost:5000/posts/${params.postId}`)).data;
    this.setState({
      post: post.json_post,
    });
  }

  async submitComment(comment) {
    const { match: { params } } = this.props;
    await axios.post(`http://localhost:5000/posts/${params.postId}/comment`, {
      comment,
    });
    await this.refreshPage();
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
            <p>Discussion:</p>
              <p className="lead">
              {
                post.comments && post.comments.map((comment, idx) => (
                  <p className="lead" key={idx}>{comment}</p>
                ))
              }
              </p>
          </div>
        </div>
      </div>
    )
  }
}

export default Post;
