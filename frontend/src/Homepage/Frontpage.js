import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import welcome from '../Files/welcome.png';
import congrats from '../Files/congrats.png';
import member from '../Files/member.png';
import join from '../Files/join.png';
import Container from 'react-bootstrap/Container'


class Frontpage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container fluid>
                <Carousel>
                    <Carousel.Item>
                        <img
                        className="d-block w-100"
                        src={welcome}
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={congrats}
                        />
                    </Carousel.Item>
                    {localStorage.getItem('loggedIn') !== "true" &&
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={join}
                            />
                            <Carousel.Caption>
                                <Link to={`/signup`}><h3>Sign up here!</h3></Link>
                            </Carousel.Caption>
                        </Carousel.Item>
                    }
                    {localStorage.getItem('loggedIn') === "true" &&
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={member}
                            />
                            <Carousel.Caption>
                                <Link to={`/all`}><h4>Check out everyone's posts here!</h4></Link>
                                <Link to={`/fav`}><h4>Or, look at your followed users' posts!</h4></Link>
                            </Carousel.Caption>
                        </Carousel.Item>
                    }
                </Carousel>
            </Container>
        )
    }
}

export default Frontpage;