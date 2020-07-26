import React, {Component} from 'react';
import axios from 'axios';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import {Link} from 'react-router-dom';
import Truncate from 'react-truncate';
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import joined_badge from '../Files/joined_badge.png'
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed'

class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      posts: null,
      user_is_following: null,
      user_is_followed_by: null,
      likedPosts: null,
      points: 0,
    };
  }

  async componentDidMount() {
    let userData = {"email": localStorage.getItem('userEmail')}
    console.log(userData);
    axios.post('http://localhost:5000/profile', userData)
    .then((response) => {
      const posts = response.data.user_info[0].posts;

      let arr = [];
      for (var i in posts) {
        arr.push(posts[i])
      }
      this.setState({
        posts: arr,
        user_is_following: response.data.user_info[3].user_is_following,
        user_is_followed_by: response.data.user_info[4].user_is_followed_by,
        points: response.data.user_info[2].points,
      });
      const likedPosts = response.data.user_info[1];
      let arr2 = [];
      for (var i in likedPosts) {
        arr2.push(likedPosts[i])
      }
      this.setState({
        likedPosts: arr2,
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

  following = () => {
    if (this.state.user_is_following && this.state.user_is_following.length) {
      return (
        this.state.user_is_following.map(f =>
          <Link to={ `/users/${f.user_id}` }><ListGroup.Item action variant="success">{ f.name }</ListGroup.Item></Link>
        )
      );
    }
    return (
      <ListGroup.Item>No followed users here! :D</ListGroup.Item>
    );
  }

  followedBy = () => {
    if (this.state.user_is_followed_by && this.state.user_is_followed_by.length) {
      return (
        this.state.user_is_followed_by.map(f =>
          <Link to={ `/users/${f.user_id}` }><ListGroup.Item action variant="success">{ f.name }</ListGroup.Item></Link>
        )
      );
    } else {
      return (
        <ListGroup.Item>No followers here! :D</ListGroup.Item>
      );
    }
  }

  render() {
    return (
      <div className="container">
        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
          <Tab eventKey="profile" title="Profile">
            <div className="row">
              <div className="jumbotron col-12">
                <h1 className="display-3">{localStorage.getItem('userName')}</h1>
                <h3 className="display-7">Points: {this.state.points}</h3>
                <h3 className="display-7">Badges:</h3>
                <ResponsiveEmbed aspectRatio="1by1">
                  <embed type="image/png" src={joined_badge} />
                </ResponsiveEmbed>
                {this.state.points >= 10 &&
                  <ResponsiveEmbed aspectRatio="1by1">
                    <embed type="image/png" src={joined_badge} />
                  </ResponsiveEmbed>
                }
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
          <Tab eventKey="liked-posts" title="Liked Posts">
            <div className="row">
            {this.state.likedPosts && this.state.likedPosts.map(post => (
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
            <ListGroup variant="flush">
              <this.followedBy />
            </ListGroup>
          </Tab>
          <Tab eventKey="following" title="Following">
            <ListGroup variant="flush">
              <this.following />
            </ListGroup>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default Profile;
