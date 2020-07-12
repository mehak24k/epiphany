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

class Posts extends Component {

  constructor(props) {
    super(props);

    this.state = {
      posts: null,
      filteredPosts: null,
      tags: null,
      tagsList: null,
    };
    this.filterPosts = this.filterPosts.bind(this);
    this.filterTags = this.filterTags.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
  }

  async componentDidMount() {
      const data = (await axios.get('http://localhost:80/')).data;
      console.log(data.data[0]);
      const posts = data.data[0];
      const tags = data.data[1];
      console.log(posts);
      let arr = [];
      for (var i in posts) {
        arr.push(posts[i])
      }
      console.log(arr);
      let tagArr = [];
      for (var j in tags) {
        tagArr.push(tags[j])
      }
      this.setState({
        posts: arr,
        filteredPosts: arr,
        tagsList: tagArr,
      });
      console.log(this.state.posts);
      console.log(this.state.filteredPosts);
      console.log(this.state.tagsList);
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
    console.log(event.target.id)
    let arr = [];
    if (this.state.tags === null){
      arr = [];
    } else {
      arr = this.state.tags;
    }

    const index = arr.indexOf(event.target.id)
    console.log(index);
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
    console.log(arr);

  }

  filterTags(event) {
    if (event.keyCode === 39) {
      let arr = [];
      if (this.state.tags === null){
        arr = [];
      } else {
        arr = this.state.tags;
      }
      arr.push(event.target.value)
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
    console.log(this.state.tags);
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
    return (
      <div className="container">
        <div className="row">
        <Col>
          <Form>
            <Form.Group controlId="formSearch">
            <Form.Control label="freeSolo" type="text" placeholder="Search posts!" onChange={this.filterPosts}/>
              <Form.Text className="text-muted">
                Here, you can search with text that matches the title or body of the posts.
              </Form.Text>
            </Form.Group>
          </Form>
          </Col>
        </div>
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
            <TextField {...params}  id="standard-full-width" label="Search with tags!" margin="normal" variant="outlined" onKeyUp={this.filterTags}/>
          )}
        />
        </div>
      }
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
