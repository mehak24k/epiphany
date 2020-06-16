import React, {Component} from 'react';
import axios from 'axios';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
    };
  }

  async componentDidMount() {
    const { match: { params } } = this.props;
    const post = (await axios.get(`http://localhost:5000/posts/${params.postId}`)).data;
    this.setState({
      post: post.json_post,
    });
  }

  render() {
    const {post} = this.state;
    if (post === null) return <p>Loading ...</p>;
    return (
      <div className="container">
        <div className="row">
          <div className="jumbotron col-12">
            <h1 className="display-3">{post.title}</h1>
            <p className="lead">{post.title}</p>
            <hr className="my-4" />
            <p>Content:</p>
              <p className="lead">{post.body}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Post;
