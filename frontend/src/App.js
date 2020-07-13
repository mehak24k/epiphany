import React, { Component} from 'react';
import {Route} from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import Post from './Post/Post';
import Posts from './Posts/Posts';
import Login from './Login/Login';
import Profile from './Profile/Profile';
import NewPost from './CreatePosts/NewPost';

class App extends Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.state = {
      login: false,
    };
  }

  login() {
    this.setState({login: true});
  }

  logout() {
    localStorage.clear();
    this.setState({login: false});
  }

  render() {
    const token = localStorage.getItem('loggedIn');
    console.log(token);

  return (
      <div>
        <NavBar callback={this.logout}/>
        <Route exact path='/' component={Posts}/>
        <Route exact path='/post/:postId' component={Post}/>
        {localStorage.getItem('loggedIn') != "true" && <Route exact path='/login' component={() => <Login callback={this.login}/>}/>}
        <Route exact path='/profile' component={Profile}/>
        <Route exact path='/post' component={NewPost}/>
      </div>
    );
  }
}

export default App;
