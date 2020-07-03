/*
import React, {Component} from 'react';


export const UserContext = React.createContext();
export const UserConsumer = UserContext.Consumer;
class UserProvider extends Component {
  // Context state
  state = {
    user: { name: 'Jim', loggedIn: false },
  }

  // Method to update state
    setUser = user => {
      //this.setState({ user })
      this.setState(prevState => ({ user }))
    }

  render() {
    const { children } = this.props
    const { user } = this.state
    const { setUser } = this

    return (
      <UserContext.Provider
        value={{
          user,
          setUser,
        }}
      >
        {children}
      </UserContext.Provider>
    )
  }
}

export default UserContext;
export { UserProvider }

*/
import React from 'react';

const userContext = React.createContext({user: {}}); // Create a context object

export {
  userContext // Export it so it can be used by other Components
};
