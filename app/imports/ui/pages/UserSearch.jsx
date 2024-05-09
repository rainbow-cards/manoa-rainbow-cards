import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { Navigate } from 'react-router-dom';

const UserSearch = () => {
  const [redirect, setRedirect] = useState(false);
  const [userId, setUserId] = useState('');
  Meteor.subscribe('allIds');

  const bridge = new SimpleSchema2Bridge(new SimpleSchema({
    userName: { label: 'Enter a user', type: String },
  }));

  const submit = (data) => {
    const { userName } = data;
    const user = Meteor.users.findOne({ username: userName });
    if (user) {
      console.log(user);
      setUserId(user._id);
      setRedirect(true);
      console.log('Operation complete');
    } else {
      console.log(user);
      swal('Error', 'User profile not found', 'error');
    }
  };

  if (redirect) {
    return (<Navigate to={`/catalog/${userId}`} />);
  }
  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={7}>
          <Col className="text-center greentxt"><h2>User Profile Search</h2></Col>
          <AutoForm schema={bridge} onSubmit={data => submit(data)}>
            <Card>
              <Card.Body className="greentxt bg-success-subtle">
                <TextField id="search-bar" name="userName" placeholder="Enter a user email" />
                <ErrorsField />
                <SubmitField id="submit-button" />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

export default UserSearch;
