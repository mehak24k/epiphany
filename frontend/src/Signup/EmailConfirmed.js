import React, {Component} from 'react';
import Alert from 'react-bootstrap/Alert'

class EmailConfirmed extends Component {
  render() {
    return (
      <Alert variant='success' style={{marginLeft: 20, marginRight: 20}}>
        Email Confirmed! Please login to access your account.
      </Alert>
    );
  }
}

export default EmailConfirmed;
