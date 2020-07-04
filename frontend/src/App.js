import React, { Component} from 'react';
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
    const token = localStorage.getItem('loggedIn');
    console.log(token);
  }

  login() {
    this.setState({login: true});
    console.log(this.state.login);
  }

  logout() {
    this.setState({login: false});
    localStorage.setItem('loggedIn', false);
    console.log(this.state.login);
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
      </div>
    );
  }
}

export default App;
