import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col } from 'react-bootstrap';

/* After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
const SignOut = () => {
  Meteor.logout();
  return (
    <Col id="signout-page" className="greentxt text-center d-flex justify-content-center align-items-center py-3">
      <div className="alert alert-success w-50 h-25" role="alert">
        <h2>You have signed out of your Mānoa Rainbow Trading Cards account.</h2>
      </div>
    </Col>
  );
};

export default SignOut;
