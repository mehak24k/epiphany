import React, {Component} from 'react';
import axios from 'axios';
import Nav from 'react-bootstrap/Nav'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import {Link} from 'react-router-dom';
import Truncate from 'react-truncate';
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      posts: null,
    };
  }

  async componentDidMount() {
    let userData = {"email": localStorage.getItem('userEmail')}
    console.log(userData);
    axios.post('http://localhost:5000/profile', userData)
    .then((response) => {
      console.log(response.data.posts);
      const posts = response.data.posts;
      let arr = [];
      for (var i in posts) {
        arr.push(posts[i])
      }
      this.setState({
        posts: arr,
      });
    }, (error) => {
      console.log('Looks like there was a problem: \n', error);
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
        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
          <Tab eventKey="profile" title="Profile">
            <div className="row">
              <div className="jumbotron col-12">
                <h1 className="display-3">{localStorage.getItem('userName')}</h1>
                <h2 className="display-3">Points: {localStorage.getItem('userPoints')}</h2>
              </div>
            </div>
          </Tab>
          <Tab eventKey="posts" title="Posts">
            <div className="row">
            {this.state.posts && this.state.posts.map(post => (
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
          </Tab>
          <Tab eventKey="followers" title="Followers">
            hi
          </Tab>
          <Tab eventKey="following" title="Following">
            hello again2
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default Profile;
