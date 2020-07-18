import React, {Component} from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import { Redirect } from "react-router-dom";
import Row from 'react-bootstrap/Row'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import {TextField} from '@material-ui/core/';
import {Autocomplete} from '@material-ui/lab/';
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'

class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body:'',
      posted: false,
      tagsList: null,
      tags: null,
      newTags: null,
      errorMessage: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addTag = this.addTag.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
  }

  async componentDidMount() {
      const data = (await axios.get('https://epiphany-test-three.herokuapp.com/main')).data;
      console.log(data.data[0]);
      const tags = data.data[1];
      let tagArr = [];
      for (var j in tags) {
        tagArr.push(tags[j])
      }
      this.setState({
        tagsList: tagArr,
      });
      console.log(this.state.tagsList);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
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
    console.log(arr);
    this.setState({
      tags: arr,
    })

    let arr2 = [];
    if (this.state.newTags === null){
      arr2 = [];
    } else {
      arr2 = this.state.newTags;
    }
    if (arr2.indexOf(event.target.id) !== -1) {
      arr2.splice(index, 1)
      this.setState({
        newTags: arr2,
      })
    }
    console.log(arr2);

  }

  addTag(event) {
    this.setState({
      errorMessage: '',
    })
    if (event.keyCode === 13) {
      if (this.state.tags !== null && this.state.tags.some(tag => tag.toLowerCase() === event.target.value.toLowerCase())) {
        this.setState({
          errorMessage: "Tag has already been added."
        })
      } else {
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
        });
      }
      console.log(this.state.tags);
      // this means the tag is new.
      if (this.state.tagsList.some(tag => tag.name.toLowerCase() === event.target.value.toLowerCase())) {

      } else {
        let arr2 = [];
        if (this.state.newTags === null){
          arr2 = [];
        } else {
          arr2 = this.state.newTags;
        }
        arr2.push(event.target.value)
        this.setState({
          newTags: arr2,
        });
      }
    }
  }

  async handleSubmit(event) {
    let postData = {"title": this.state.title, "body": this.state.body, "user": localStorage.getItem("userEmail"), "tags": this.state.tags, "newTags": this.state.newTags}
    console.log(postData);
    if (this.state.title === '' || this.state.body === '' || this.state.tags === null) {
      this.setState({
        errorMessage: "Please fill in all fields."
      })
    } else {
      axios.post('http://localhost:5000/create', postData)
      .then((response) => {
        console.log(response);
        this.setState({
          posted: true,
        })
      }, (error) => {
        console.log('Looks like there was a problem: \n', error);
      });
    }
      event.preventDefault();
  }

  render() {
    const top100Films = this.state.tagsList;
    const redirectTo = this.state.posted;
    if (redirectTo) {
        return (
          <Redirect to="/" />
        );
    }
    return (
      <Col style={{paddingLeft: 200, paddingRight: 200}}>
      {this.state.tagsList === null && <div> <Spinner animation="border" variant="primary" /> <p>Loading...</p></div>}
      { this.state.errorMessage &&
        <Alert variant='danger'> { this.state.errorMessage } </Alert> }
      {this.state.tagsList &&
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="formGroupTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} type="text" name="title" placeholder="Enter title" title={this.state.title} onChange={this.handleChange} />
          </Form.Group>
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
              <TextField {...params}  onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} id="standard-full-width" label="Add tags!" margin="normal" variant="outlined" onKeyUp={this.addTag}/>
            )}
          />
          </div>
        }
          </div>
            <Form.Group controlId="formGroupPassword">
              <Form.Label>Body</Form.Label>
              <Form.Control onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} as="textarea" rows="15" name="body" placeholder="Body" body={this.state.body} onChange={this.handleChange}/>
          </Form.Group>
          <Button variant="success" type="submit">Submit</Button>
        </Form>
      }
      </Col>
    );
  }
}

export default NewPost;
