import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Truncate from 'react-truncate';
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Tab from 'react-bootstrap/Tab'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Nav from 'react-bootstrap/Nav'


class Posts extends Component {

    constructor(props) {
      super(props);
  
      this.state = {
        list: null,
      };
    }

    async componentDidMount() {
        let loginData = {"email": localStorage.getItem("userEmail")}
        console.log(loginData)
        axios.post('http://localhost:5000/fav', loginData)
        .then((response) => {
            const lists = response.data.info[0];
            let arr = [];
            for (var i in lists) {
              arr.push(lists[i])
              console.log(lists[i])
            }
            this.setState({
              list: arr,
            });
            console.log(this.state.list.length);
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
        <Container className="justify-content-md-center">
          {this.state.list === null && <Row className="mt-3"> <Spinner animation="border" variant="primary" /> <p>Loading posts...</p></Row>}
          {this.state.list && this.state.list.length === 0 && <h4 style={{textAlign: "center"}}> No followed posts. </h4>}
          {this.state.list &&
          <Nav className="justify-content-end">
        <NavDropdown title="Sort By" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.1" href="/all-time">Time</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.2" href="/all-votes">Votes</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.3" href="/fav">Followed Posts</NavDropdown.Item>
      </NavDropdown>
      </Nav>
    }
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  {this.state.list && this.state.list.map(thing => (
                    <Nav.Item>
                      <Nav.Link eventKey={thing.username}>{ thing.username }</Nav.Link>
                    </Nav.Item>
                  ))
                  }
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  {this.state.list && this.state.list.map(thing => (
                    <Tab.Pane eventKey={ thing.username }>
                      <div className="row">
                        {thing.post_list && thing.post_list.map(another => (
                          <div key={ another.id } className="col-sm-12 col-md-4 col-lg-3 mb-3">
                            <Link to={`/post/${another.id}`}>
                              <Card style={{backgroundColor: this.getColor(), color: "#161717", height: '250px'}}>
                                <Card.Body>
                                  <Card.Title>{another.title}</Card.Title>
                                  <Card.Text style={{maxLength: "100"}}>
                                    <Truncate lines={1}>
                                      {another.body}
                                    </Truncate>
                                  </Card.Text>
                                </Card.Body>
                              </Card>
                            </Link>
                          </div>
                        ))
                        }
                      </div>
                    </Tab.Pane>
                  ))}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
      )
    }
  }
  
  export default Posts;