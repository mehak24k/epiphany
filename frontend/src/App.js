import React, { Component} from 'react';
import {Route} from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import Post from './Post/Post';
import Posts from './Homepage/Posts';
import Login from './Login/Login';
import Profile from './Profile/Profile';
import NewPost from './CreatePosts/NewPost';
import UpdatePost from './Post/UpdatePost';
import Signup from './Signup/Signup';
import EmailSent from './Signup/EmailSent';
import EmailConfirmed from './Signup/EmailConfirmed';
import UserProfile from './Profile/UserProfile';
import { Redirect } from "react-router-dom";
import NewVideo from './CreatePosts/NewVideo';
import Create from './CreatePosts/Create';
import Frontpage from './Homepage/Frontpage';
import FollowedPosts from './Homepage/FollowedPosts';
import PostsVotes from './Homepage/PostsVotes';


class App extends Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.state = {
      login: false,
      loggedOut: false,
    };
  }

  login() {
    this.setState({login: true});
  }

  logout() {
    localStorage.clear();
    this.setState({
      login: false,
      loggedOut: true,
    });
  }

  render() {
    const token = localStorage.getItem('loggedIn');
    console.log(token);
    const redirectTo = this.state.loggedOut;
    if (redirectTo) {
        return (
          <div>
          <NavBar callback={this.logout}/>
          <h1 style={{textAlign: "center"}}>Logged out!</h1>
          </div>
        );
    }
    return (
      <div>
        <NavBar callback={this.logout}/>
        <Route exact path='/' component={Frontpage}/>
        <Route exact path='/all-votes' component={PostsVotes}/>
        <Route exact path='/all-time' component={Posts}/>
        <Route exact path='/fav' component={FollowedPosts}/>
        <Route exact path='/post/:postId' component={Post}/>
        <Route exact path='/users/:userId' component={UserProfile}/>
        <Route exact path='/signup' component={Signup}/>
        <Route exact path='/email_sent' component={EmailSent}/>
        <Route exact path='/email_confirmed' component={EmailConfirmed}/>
        {localStorage.getItem('loggedIn') !== "true" && <Route exact path='/login' component={() => <Login callback={this.login}/>}/>}
        {localStorage.getItem('loggedIn') === "true" && <Route exact path='/new-video' component={NewVideo}/>}
        {localStorage.getItem('loggedIn') === "true" && <Route exact path='/create' component={Create}/>}
        {localStorage.getItem('loggedIn') === "true" && <Route exact path='/profile' component={Profile}/>}
        {localStorage.getItem('loggedIn') === "true" && <Route exact path='/post' component={NewPost}/>}
        {localStorage.getItem('loggedIn') === "true" && <Route exact path='/post/:postId/update' component={UpdatePost}/>}
      </div>
    );
  }
}

export default App;
