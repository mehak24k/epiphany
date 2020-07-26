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
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import {TextField} from '@material-ui/core/';
import {Autocomplete} from '@material-ui/lab/';
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'

class Posts extends Component {

  constructor(props) {
    super(props);

    this.state = {
      posts: null,
      filteredPosts: null,
      tags: null,
      tagsList: null,
      key: 0,
    };
    this.filterPosts = this.filterPosts.bind(this);
    this.filterTags = this.filterTags.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
  }

  async componentDidMount() {
      const data = (await axios.get('https://epiphany-test-three.herokuapp.com/main')).data;

      const posts = data.data[0];
      const tags = data.data[1];
      let arr = [];
      for (var i in posts) {
        arr.push(posts[i])
      }
      let tagArr = [];
      for (var j in tags) {
        tagArr.push(tags[j])
      }
      this.setState({
        posts: arr,
        filteredPosts: arr,
        tagsList: tagArr,
      });
  }

  filterPosts(event) {
    this.setState({
      filteredPosts: this.state.posts.filter(post => {
        return post.title.toLowerCase().includes(event.target.value.toLowerCase())
        || post.body.toLowerCase().includes(event.target.value.toLowerCase())
      })
    });
  }

  deleteTag(event) {
    let arr = [];
    if (this.state.tags === null){
      arr = [];
    } else {
      arr = this.state.tags;
    }

    const index = arr.indexOf(event.target.id)
    arr.splice(index, 1)
    this.setState({
      tags: arr,
      filteredPosts: this.state.posts.filter(post => {
        var check = false;
        let count = 0;
        arr.forEach(myTag => {
          post.tags.forEach(tag => {
            if (tag.name.toLowerCase().includes(myTag.toLowerCase())) {
              count = count + 1;
            }
          })
        });
        if (count === arr.length) {
          check = true;
        } else {
          check = false;
        }
        return check;
      }),
    })
  }

  filterTags(event) {
    if (event.keyCode === 13) {
      if (this.state.tags !== null && this.state.tags.some(tag => tag.toLowerCase() === event.target.value.toLowerCase())) {
        this.setState({
          errorMessage: "Tag has already been added."
        })
      } else if (!this.state.tagsList.some(tag => tag.name.toLowerCase() === event.target.value.toLowerCase())) {
        this.setState({
          errorMessage: "Tag does not exist."
        })
      } else {
        this.setState({
          errorMessage: ''
        })
        let arr = [];
        if (this.state.tags === null){
          arr = [];
        } else {
          arr = this.state.tags;
        }
        let tempArr = this.state.tagsList.map(function(value) {
          return value.name.toLowerCase();
        });
        if (tempArr.indexOf(event.target.value.toLowerCase()) !== -1) {
          arr.push(this.state.tagsList[tempArr.indexOf(event.target.value.toLowerCase())].name);
        } else {
          arr.push(event.target.value)
        }
        this.setState({
          tags: arr,
          filteredPosts: this.state.posts.filter(post => {
            var check = false;
            let count = 0;
            arr.forEach(myTag => {
              post.tags.forEach(tag => {
                if (tag.name.toLowerCase().includes(myTag.toLowerCase())) {
                  count = count + 1;
                }
              })
            });
            if (count === arr.length) {
              check = true;
            } else {
              check = false;
            }
            return check;
          }),
        });
      }
  }
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
    const top100Films = this.state.tagsList;
    let first = 0;
    function myKey() {
      first = first + 1;
      return first;
    }
    return (
      <Container className="justify-content-md-center">
        <div className="row">
        <Col>
          <Form>
            <Form.Group controlId="formSearch">
            <Form.Control onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} label="freeSolo" type="text" placeholder="Search posts!" onChange={this.filterPosts}/>
              <Form.Text className="text-muted">
                Here, you can search with text that matches the title or body of the posts.
              </Form.Text>
            </Form.Group>
          </Form>
          </Col>
        </div>

        <Row className="justify-content-md-center">
        { this.state.errorMessage &&
          <Alert variant='danger'> { this.state.errorMessage } </Alert> }
        </Row>
        <div className="row">
          <Row style={{paddingLeft: 25}}>
          {this.state.tags && this.state.tags.map(tag => (
            <ButtonGroup style={{ paddingLeft: 2, paddingRight: 2, paddingTop: 2, paddingBottom: 5}} aria-label="Basic example">
              <Button onClick={this.deleteTag} id={tag} variant="secondary">x</Button>
              <Button variant="secondary">{tag}</Button>
            </ButtonGroup>
            ))
        }
          </Row>
        </div>
        <div className="row">
        {this.state.tagsList && <div style={{ width: 1125, paddingLeft: 15 }}>
        <Autocomplete
          id="free-solo-demo"
          freeSolo
          options={top100Films.map((option) => option.name)}
          renderInput={(params) => (
            <TextField {...params}  onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} id="standard-full-width" label="Search with tags!" margin="normal" variant="outlined" onKeyUp={this.filterTags}/>
          )}
        />
        </div>
      }
        </div>

        {this.state.posts === null && <div> <Spinner animation="border" variant="primary" /> <p>Loading posts...</p></div>}
        {this.state.filteredPosts && this.state.filteredPosts.map(post => (
          <Row className="justify-content-md-center">

          <Card key={post.id} style={{backgroundColor: this.getColor(), marginTop: 10, marginBottom: 10, alignItems: "center", width: '50rem'}}>
            <Link key={myKey()} to={`/post/${post.id}`}>
                <Card.Body>
                  <Card.Title style={{color: "#161717", textAlign: "center"}}>{post.title}</Card.Title>
                  <Row className="justify-content-md-center">
                  {post.tags && post.tags.map(tag => (
                    <Col key={myKey()} style={{ paddingLeft: 2, paddingRight: 2, alignItems: "center" }} md="auto">
                      <Badge variant="info">{tag.name}</Badge>
                    </Col>
                    ))
                  }
                  </Row>
                  <Card.Text style={{color: "#161717", textAlign: "center"}}>
                  <Truncate lines={2}>
                      {post.body}
                  </Truncate>
                  </Card.Text>
                </Card.Body>
                </Link>
                <Link key={myKey()} to={`/users/${post.user_id}`}>
                <Card.Footer className="text-muted" style={{color: "#161717", textAlign: "center"}}>
                Posted by {post.user} at {post.time}
                </Card.Footer>
                </Link>
            </Card>
            </Row>
          ))
        }
      </Container>
    )
  }
}

export default Posts;