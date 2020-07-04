import React, {Component} from 'react';
import axios from 'axios';

class Profile extends Component {

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="jumbotron col-12">
            <h1 className="display-3">Welcome, {localStorage.getItem('userName')}!</h1>
            <h2 className="display-3">Current points: {localStorage.getItem('userPoints')}</h2>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
