import React, {Component} from 'react';
import Alert from 'react-bootstrap/Alert'

class EmailSent extends Component {
  render() {
    return (
      <Alert variant='info' style={{marginLeft: 20, marginRight: 20}}>
        Signup successful! Please check your email for the email confirmation link and click on it before login.
      </Alert>
    );
  }
}

export default EmailSent;
