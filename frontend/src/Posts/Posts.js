import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class Posts extends Component {

  constructor(props) {
    super(props);

    this.state = {
      posts: null,
    };
  }

  async componentDidMount() {
      const posts = (await axios.get('http://localhost:5000/')).data;
      let arr = [];
      for (var i in posts) {
        arr.push(posts[i])
      }
      this.setState({
        // an array of arrays
        posts: arr[0]
      });
  }

  colors = ["#ffbaba","#ffddab","#fdffcf","#bdffb3","#b8fff9","#ffd1ea","#edc4ff"];
  getColor(){
    var len = this.colors.length;
    var randomNum = Math.floor(Math.random()*len);
    var color = this.colors[randomNum];
    //this.colors.splice(randomNum, 1);
    return color;
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          {this.state.posts === null && <p>Loading posts...</p>}
          {this.state.posts && this.state.posts.map(post => (
              <div key={post.id} className="col-sm-12 col-md-4 col-lg-3">
                <Link to={`/post/${post.id}`}>
                  <div className="card mb-3" style={{backgroundColor: this.getColor(), color: "#161717"}}>
                    <div className="card-header">Title: {post.title}</div>
                    <div className="card-body">
                      <h4 className="card-title">{post.title}</h4>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

export default Posts;
