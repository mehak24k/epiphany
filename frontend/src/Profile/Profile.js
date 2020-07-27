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
import Spinner from 'react-bootstrap/Spinner'
import Card from 'react-bootstrap/Card'

class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      posts: null,
      user_is_following: null,
      user_is_followed_by: null,
      likedPosts: null,
      points: 0,
      loaded: false,
    };
  }

  async componentDidMount() {
    let userData = {"email": localStorage.getItem('userEmail')}
    console.log(userData);
    axios.post('https://epiphany-test-three.herokuapp.com/profile', userData)
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
        loaded: true,
      });
      const likedPosts = response.data.user_info[1].liked_posts;
      let arr2 = [];
      for (var i in likedPosts) {
        arr2.push(likedPosts[i])
      }
      this.setState({
        likedPosts: arr2,
        loaded: true,
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

  userPosts = () => {
    if (this.state.posts && this.state.posts.length) {
    return (
        <div className="row">
          {this.state.posts && this.state.posts.map(post => (
            <div key={post.id} className="col-sm-12 col-md-4 col-lg-3 mb-3">
              <Link to={`/post/${post.id}`}>
                <Card style={{backgroundColor: this.getColor(), color: "#161717", height: '250px'}}>
                  <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Row>
                      {post.tags && post.tags.map(tag => (
                        <Col style={{ paddingLeft: 2, paddingRight: 2 }} md="auto">
                          <Badge variant="info">{tag.name}</Badge>
                        </Col>
                        ))
                      }
                    </Row>
                    <Card.Text style={{maxLength: "100"}}>
                      <Truncate lines={1}>
                        {post.body}
                      </Truncate>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </div>
            ))
          }
        </div>
      );
    } else {
      return (
        <ListGroup.Item>No posts here! :D </ListGroup.Item>
      );
    }
  }

  userLikedPosts = () => {
    if (this.state.likedPosts && this.state.likedPosts.length) {
      return (
          <div className="row">
            {this.state.likedPosts && this.state.likedPosts.map(post => (
              <div key={post.id} className="col-sm-12 col-md-4 col-lg-3 mb-3">
                <Link to={`/post/${post.id}`}>
                  <Card style={{backgroundColor: this.getColor(), color: "#161717", height: '250px'}}>
                    <Card.Body>
                      <Card.Title>{post.title}</Card.Title>
                      <Row className="justify-content-x-center align-items-center">
                        {post.tags && post.tags.map(tag => (
                        <Col style={{ paddingLeft: 2, paddingRight: 2 }} md="auto">
                          <Badge variant="info">{tag.name}</Badge>
                        </Col>
                        ))
                        }
                      </Row>
                      <Card.Text style={{maxLength: "100"}}>
                        <Truncate lines={1}>
                          {post.body}
                        </Truncate>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </div>
            ))
          }
          </div>
        )
    } else {
      return (
        <ListGroup.Item>No liked posts here! :D</ListGroup.Item>
      );
    }
  }

  following = () => {
    if (this.state.user_is_following && this.state.user_is_following.length) {
      return (
        this.state.user_is_following.map(f =>
          <Link to={ `/users/${f.user_id}` }><ListGroup.Item action variant="success">{ f.name }</ListGroup.Item></Link>
        )
      );
    } else {
      return (
        <ListGroup.Item>No followed users here! :D</ListGroup.Item>
      );
    }
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
        {!this.state.loaded && <Row className="mt-3"> <Spinner animation="border" variant="primary" /> <p>&nbsp;Loading posts...</p></Row>}
        {this.state.loaded &&
        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
          <Tab eventKey="profile" title="Profile">
            <div className="row">
              <div className="jumbotron col-12">
                <h1 className="display-3">{localStorage.getItem('userName')}</h1>
                <h3 className="display-7">Points: {this.state.points}</h3>
                <h3 className="display-7">Badges:</h3>
                <Row>
                <Col>
                <ResponsiveEmbed aspectRatio="1by1" style={{maxWidth: 500}}>
                  <embed type="image/png"  src={joined_badge} />
                </ResponsiveEmbed>
                </Col>
                {this.state.points >= 10 &&
                  <Col>
                  <ResponsiveEmbed aspectRatio="1by1" style={{maxWidth: 500}}>
                    <embed type="image/png" src="https://epiphany-test-three.herokuapp.com/static/first-upvote.png" />
                  </ResponsiveEmbed>
                  </Col>
                }
                </Row>
              </div>
            </div>
          </Tab>
          <Tab eventKey="posts" title="Posts">
            <ListGroup variant="flush" className="mt-3">
              <this.userPosts />
            </ListGroup>
          </Tab>
          <Tab eventKey="liked-posts" title="Liked Posts">
            <ListGroup variant="flush" className="mt-3">
              <this.userLikedPosts/>
            </ListGroup>
          </Tab>
          <Tab eventKey="followers" title="Followers">
            <ListGroup variant="flush" className="mt-3">
              <this.followedBy />
            </ListGroup>
          </Tab>
          <Tab eventKey="following" title="Following">
            <ListGroup variant="flush" className="mt-3">
              <this.following />
            </ListGroup>
          </Tab>
        </Tabs>
        }
      </div>
    );
  }
}

export default Profile;
