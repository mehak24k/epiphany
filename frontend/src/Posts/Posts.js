import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Truncate from 'react-truncate';
import { UserProvider } from '../Contexts/Context'
import { UserContext } from '../Contexts/Context'

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
    if (this.colors.length === 0) {
      this.colors = ["#ffbaba","#ffddab","#fdffcf","#bdffb3","#b8fff9","#ffd1ea","#edc4ff"];
    }
    var len = this.colors.length;
    var randomNum = Math.floor(Math.random()*len);
    var color = this.colors[randomNum];
    this.colors.splice(randomNum, 1);
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
                  <div className="card mb-3" style={{backgroundColor: this.getColor(), color: "#161717", height: '250px'}}>
                  <div className="card-body">
                    <h4 className="card-title">{post.title}</h4>
                    <p className="card-text" style={{maxLength: "100"}}>
                    <Truncate lines={3}>
                        {post.body}
                    </Truncate>
                    </p>
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
