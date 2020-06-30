import React, { Component, useContext } from 'react';
import {Route} from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import Post from './Post/Post';
import Posts from './Posts/Posts';
import Login from './Login/Login';
import { UserProvider } from './Contexts/Context'
import { UserContext } from './Contexts/Context'


class App extends Component {
  static contextType = UserContext

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { user, setUser } = this.context
    const newUser = { name: 'Joe', loggedIn: true }
    setUser(newUser)
    //console.log(user.name) // { name: 'Tania', loggedIn: true }
  }

  render() {
    const { user, setUser } = this.context

  return (
    <UserProvider value={user}>
      <div>
        <NavBar/>
        <Route exact path='/' component={Posts}/>
        <Route exact path='/post/:postId' component={Post}/>
        <Route exact path='/login' component={Login}/>
      </div>
    </UserProvider>
  );
}
}

export default App;
