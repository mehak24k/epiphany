import React, {Component} from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import { Redirect } from "react-router-dom";
import Row from 'react-bootstrap/Row'


class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: false,
      video: false,
    };

    this.handleArticle = this.handleArticle.bind(this);
    this.handleVideo = this.handleVideo.bind(this);
  }

  handleArticle(event) {
    this.setState({
      article: true,
    })
    event.preventDefault();
  }

  handleVideo(event) {
    this.setState({
      video: true,
    })
    event.preventDefault();
  }

  render() {
    const article = this.state.article;
    const video = this.state.video;
    if (article) {
        return (
          <Redirect to="/post" />
        );
    }
    if (video) {
      return (
        <Redirect to="/new-video" />
      );
    }
    return (
      <Container fluid style={{height:'70vh'}}>
        <Row className="h-100 justify-content-center align-items-center">
          <Col className="justify-content-x-center">
            <h2 style={{textAlign: "center"}}> Write an article! </h2>
              <h4 style={{textAlign: "center"}}>
              Explain a concept with an article.
              <br />Articles can have a maximum length of 10000 characters.
              </h4>
              <div class="text-center">
                <Button style={{textAlign: "center"}} variant="success" onClick={this.handleArticle}>Post Article</Button>
              </div>
          </Col>
          <Col className="justify-content-x-center">
            <h2 style={{textAlign: "center"}}> Upload a video </h2>
              <h4 style={{textAlign: "center"}}>
              Explain a concept with a video.
              <br />Videos can have a maximum length of 10 minutes.
              </h4>
                <div class="text-center">
                  <Button style={{textAlign: "center"}} variant="success" onClick={this.handleVideo}>Post Video</Button>
                </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Create;
