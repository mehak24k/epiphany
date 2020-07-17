import React, { Component} from 'react';
import {Route} from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import Post from './Post/Post';
import Posts from './Posts/Posts';
import Login from './Login/Login';
import Profile from './Profile/Profile';
import NewPost from './CreatePosts/NewPost';
<<<<<<< HEAD
import UpdatePost from './Post/UpdatePost';
=======
import Signup from './Signup/Signup';
import EmailSent from './Signup/EmailSent';
import EmailConfirmed from './Signup/EmailConfirmed';
import UserProfile from './Profile/UserProfile';
>>>>>>> 2aa9a0ce8e516104becbc9de37b180d56187f039

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
        <Route exact path='/users/:userId' component={UserProfile}/>
        <Route exact path='/signup' component={Signup}/>
        <Route exact path='/email_sent' component={EmailSent}/>
        <Route exact path='/email_confirmed' component={EmailConfirmed}/>
        {localStorage.getItem('loggedIn') != "true" && <Route exact path='/login' component={() => <Login callback={this.login}/>}/>}
        <Route exact path='/profile' component={Profile}/>
        <Route exact path='/post' component={NewPost}/>
        <Route exact path='/post/:postId/update' component={UpdatePost}/>
      </div>
    );
  }
}

export default App;
