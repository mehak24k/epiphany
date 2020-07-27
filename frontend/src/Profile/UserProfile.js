import React, {Component} from 'react';
import axios from 'axios';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import {Link} from 'react-router-dom';
import Truncate from 'react-truncate';
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import joined_badge from '../Files/joined_badge.png'
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed'
import Card from 'react-bootstrap/Card'

class UserProfile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      user_id: 0,
      userPoints: 0,
      posts: null,
      email: '',
      user_is_following: null,
      user_is_followed_by: null,
      check: false,
      clicked: false,
    };
  }

  async componentDidMount() {
    this.refreshProfile();
  }

  async refreshProfile() {
    const { match: { params } } = this.props;
    let userData = {"id": params.userId, "current_user_email": localStorage.getItem('userEmail')}
    console.log(userData);
    axios.post(`https://epiphany-test-three.herokuapp.com/users/${params.userId}`, userData)
    .then((response) => {
      const posts = response.data.user_info[2].posts;
      let arr = [];
      for (var i in posts) {
        arr.push(posts[i])
      }
      this.setState({
        posts: arr,
        userName: response.data.user_info[0].name,
        user_id: response.data.user_info[4].id,
        userPoints: response.data.user_info[1].points,
        email: response.data.user_info[3].email,
        user_is_following: response.data.user_info[5].user_is_following,
        user_is_followed_by: response.data.user_info[6].user_is_followed_by,
        check: response.data.user_info[7].check,
        clicked: false,
      });
    }, (error) => {
      console.log('Looks like there was a problem: \n', error);
    });
  }

  async followUser() {
    const { match: { params } } = this.props;
    let postData = {"user_email": localStorage.getItem('userEmail')};
    axios.post(`https://epiphany-test-three.herokuapp.com/follow/${params.userId}`, postData)
    .then((response) => {
      console.log(response);
      console.log('followed');
      this.setState({
        clicked: true,
      })
    }, (error) => {
      console.log('Looks like there was a problem: \n', error);
    });
  }

  async unfollowUser() {
    const { match: { params } } = this.props;
    let postData = {"user_email": localStorage.getItem('userEmail')};
    axios.post(`https://epiphany-test-three.herokuapp.com/unfollow/${params.userId}`, postData)
    .then((response) => {
      console.log(response);
      console.log('unfollowed');
      this.setState({
        clicked: true,
      })
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

  check = () => {
    if (! this.state.check) {
      if (localStorage.getItem('loggedIn') === "true" && localStorage.getItem('userEmail') !== this.state.email) {
        return <Button size="sm" onClick={() => this.followUser()}>Follow</Button>
      }
    } else {
      if (localStorage.getItem('loggedIn') === "true" && localStorage.getItem('userEmail') !== this.state.email) {
      return <Button size="sm" onClick={() => this.unfollowUser()}>Unfollow</Button>
      }
    }
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
                      <Card.Text>
                      <p className="card-text" style={{maxLength: "100"}}>
                        <Truncate lines={1}>
                          {post.body}
                        </Truncate>
                      </p>
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
        <ListGroup.Item>No posts here!</ListGroup.Item>
      );
    }
  }

  render() {
    if (this.state.clicked) {
      this.refreshProfile();
    }
    return (
      <div className="container">
      {!this.state.userName && <div> <Spinner animation="border" variant="primary" /> <p>Loading Profile...</p></div>}
      {this.state.userName &&
        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
          <Tab eventKey="profile" title="Profile">
            <div className="row">
              <div className="jumbotron col-12">
                <Row>
                  <Col>
                    <h1 className="display-3">{this.state.userName} <this.check/> </h1>
                    <h2 className="display-7">Points: {this.state.userPoints}</h2>
                    <h3 className="display-7">Badges:</h3>
                    <Row>
                      <Col>
                        <ResponsiveEmbed aspectRatio="1by1" style={{maxWidth: 500}}>
                          <embed type="image/png" src={joined_badge} />
                        </ResponsiveEmbed>
                      </Col>
                      {this.state.userPoints >= 10 &&
                        <Col>
                          <ResponsiveEmbed aspectRatio="1by1" style={{maxWidth: 500}}>
                            <embed type="image/png" src="https://epiphany-test-three.herokuapp.com/static/first-upvote.png" />
                          </ResponsiveEmbed>
                        </Col>
                      }
                    </Row>
                  </Col>
                </Row>
              </div>
            </div>
          </Tab>
          <Tab eventKey="posts" title="Posts">
            <ListGroup variant="flush">
              <this.userPosts />
            </ListGroup>
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
      }
      </div>
    );
  }
}

export default UserProfile;
