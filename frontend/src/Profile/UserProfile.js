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
import Spinner from 'react-bootstrap/Spinner'
import joined_badge from '../Files/joined_badge.png'
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed'

class UserProfile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      userPoints: 0,
      posts: null,
    };
  }

  async componentDidMount() {
    const { match: { params } } = this.props;
    let userData = {"id": params.userId}
    console.log(userData);
    axios.post(`http://localhost:5000/users/${params.userId}`, userData)
    .then((response) => {
      console.log(response.data.user_info[0]);

      const posts = response.data.user_info[2].posts;
      let arr = [];
      for (var i in posts) {
        arr.push(posts[i])
      }
      this.setState({
        posts: arr,
        userName: response.data.user_info[0].name,
        userPoints: response.data.user_info[1].points,
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
      {!this.state.userName && <div> <Spinner animation="border" variant="primary" /> <p>Loading Profile...</p></div>}
      {this.state.userName &&
        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
          <Tab eventKey="profile" title="Profile">
            <div className="row">
              <div className="jumbotron col-12">
                <h1 className="display-3">{this.state.userName}</h1>
                <h2 className="display-3">Points: {this.state.userPoints}</h2>
                <h3 className="display-3">Badges:</h3>
                <Row>
                <Col>
                <ResponsiveEmbed aspectRatio="1by1">
                  <embed type="image/png" src={joined_badge} />
                </ResponsiveEmbed>
                </Col>
                {this.state.userPoints >= 10 &&
                  <Col>
                  <ResponsiveEmbed aspectRatio="1by1">
                    <embed type="image/png" src={joined_badge} />
                  </ResponsiveEmbed>
                  </Col>
                }
                </Row>
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
            hello again
          </Tab>
          <Tab eventKey="following" title="Following">
            hello again2
          </Tab>
        </Tabs>
      }
      </div>
    );
  }
}

export default UserProfile;
