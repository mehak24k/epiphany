import React, { Component, useContext } from 'react';
import {Route} from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import Post from './Post/Post';
import Posts from './Posts/Posts';
import Login from './Login/Login';


class App extends Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.state = {
      login: false,
    };
  }

  componentDidMount() {
    const token = sessionStorage.getItem('loggedIn');
    console.log(token);
    //sessionStorage.clear();
  }

  login() {
    this.setState({login: true});
    console.log(this.state.login);
  }

  logout() {
    this.setState({login: false});
    sessionStorage.setItem('loggedIn', false);
    console.log(this.state.login);
  }

  render() {
    const token = sessionStorage.getItem('loggedIn');
    // token seems to get erased when App component re-renders after setState
    console.log(token);
    //console.log(localStorage.getItem('token'));
    //console.log(localStorage.getItem('loggedIn'));

  return (
      <div>
        <NavBar callback={this.logout}/>
        <Route exact path='/' component={Posts}/>
        <Route exact path='/post/:postId' component={Post}/>
        <Route exact path='/login' component={() => <Login callback={this.login}/>}/>
      </div>
  );
}
}

export default App;
