import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Truncate from 'react-truncate';
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class Posts extends Component {

  constructor(props) {
    super(props);

    this.state = {
      posts: null,
      filteredPosts: null,
    };
    this.filterPosts = this.filterPosts.bind(this);
  }

  async componentDidMount() {
      const posts = (await axios.get('http://localhost:5000/')).data;
      let arr = [];
      for (var i in posts) {
        arr.push(posts[i])
      }
      this.setState({
        // an array of arrays
        posts: arr[0],
        filteredPosts: arr[0],
      });
      console.log(this.state.posts);
      console.log(this.state.filteredPosts);
  }

  filterPosts(event) {
    this.setState({
      filteredPosts: this.state.posts.filter(post => {
        return post.title.toLowerCase().includes(event.target.value.toLowerCase())
        || post.body.toLowerCase().includes(event.target.value.toLowerCase())
      })
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
        <Col>
          <Form>
            <Form.Group controlId="formSearch">
              <Form.Control type="text" placeholder="Search posts!" onChange={this.filterPosts}/>
              <Form.Text className="text-muted">
                Here, you can search with text that matches the title or body of the posts.
              </Form.Text>
            </Form.Group>
          </Form>
          </Col>
        </div>
        <div className="row">
          {this.state.posts === null && <div> <Spinner animation="border" variant="primary" /> <p>Loading posts...</p></div>}
          {this.state.filteredPosts && this.state.filteredPosts.map(post => (
              <div key={post.id} className="col-sm-12 col-md-4 col-lg-3">
                <Link to={`/post/${post.id}`}>
                  <div className="card mb-3" style={{backgroundColor: this.getColor(), color: "#161717", height: '250px'}}>
                  <div className="card-body">
                    <h4 className="card-title">{post.title}</h4>
                    <Row>
                    {post.tags && post.tags.map(tag => (
                      <Col style={{ paddingLeft: 2, paddingRight: 2 }} md="auto">
                        <Badge variant="info">{tag.name}</Badge>
                      </Col>
                      ))
                    }
                    </Row>
                    <p className="card-text" style={{maxLength: "100"}}>
                    <Truncate lines={2}>
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
