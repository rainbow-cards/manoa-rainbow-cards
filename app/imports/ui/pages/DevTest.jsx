import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField, SelectField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';

const AllCards = [
  {
    name: 'Philip Johnson',
    course: 'ICS314',
    semester: 'Spring 2024',
    department: 'ICS',
    email: 'pjohnson@hawaii.edu',
    image: 'https://github.com/philipmjohnson.png',
    facts: 'I am a Professor of Information and Computer Sciences at the University of Hawaii, Director ' +
      'of the Collaborative Software Development Laboratory, and the CEO of OpenPowerQuality.com.',
    campusEats: 'Panda',
  },
  {
    name: 'Henri Casanova',
    course: 'ICS111',
    semester: 'Spring 2024',
    department: 'ICS',
    email: 'pjohnson@hawaii.edu',
    image: 'https://avatars0.githubusercontent.com/u/7494478?s=460&v=4',
    facts: 'I am a Professor of Information and Computer Sciences at the University of Hawaii, Director ' +
      'of the Collaborative Software Development Laboratory, and the CEO of OpenPowerQuality.com.',
    campusEats: 'Panda',
  },
  {
    name: 'Kim Binsted',
    course: 'ICS212',
    semester: 'Spring 2024',
    department: 'ICS',
    email: 'pjohnson@hawaii.edu',
    image: 'https://www.ics.hawaii.edu/wp-content/uploads/2013/08/kim_binsted-square-300x300.jpg',
    facts: 'I am a Professor of Information and Computer Sciences at the University of Hawaii, Director ' +
      'of the Collaborative Software Development Laboratory, and the CEO of OpenPowerQuality.com.',
    campusEats: 'Subway',
  },
  {
    name: 'Kim Binsted',
    course: 'ICS212',
    semester: 'Fall 2023',
    department: 'ICS',
    email: 'pjohnson@hawaii.edu',
    image: 'https://www.ics.hawaii.edu/wp-content/uploads/2013/08/kim_binsted-square-300x300.jpg',
    facts: 'I am a Professor of Information and Computer Sciences at the University of Hawaii, Director ' +
      'of the Collaborative Software Development Laboratory, and the CEO of OpenPowerQuality.com.',
    campusEats: 'L&L Hawaiian BBQ',
  },
];

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  card: { label: 'Select a card', type: String, allowedValues: AllCards.map(card => `${card.name} (${card.semester}, ${card.course})`) },
  user: { label: 'Enter a user', type: String },
});
const subscriptionUsernames = Meteor.subscribe('allUsernames');
const bridge = new SimpleSchema2Bridge(formSchema);

/* Renders the DevTest page section for sending a card to a user. */
const DevTest = () => {
  // On submit, insert the data.
  const submit = (giftData, formRef) => {
    const { card, user } = giftData;
    // Find the user by their username via string
    const targetUser = Meteor.users.findOne({ username: user });

    if (!targetUser) {
      swal('Error', `User ${user} not found`, 'error');
    } else {
      swal('Success', `User ${user} exists!`, 'success');
    }
    // Add the card data to the user's profile(?)
    // change this based on database structure
    // const updatedProfile = { ...targetUser.profile, card };
    //
    // // Update the user's profile in the Meteor.users collection
    // Meteor.users.update(targetUser._id, { $set: { profile: updatedProfile } }, (error) => {
    //   if (error) {
    //     swal('Error', error.message, 'error');
    //   } else {
    //     swal('Success', 'Card added to user successfully', 'success');
    //     formRef.reset();
    //   }
    // });
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={7}>
          <Col className="text-center"><h2>Send Card (DEV ONLY)</h2></Col>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Card>
              <Card.Body>
                <SelectField
                  name="card"
                  showInlineError
                  help="Select a Rainbow Card (required)"
                  helpClassName="text-danger"
                />
                <TextField
                  name="user"
                  showInlineError
                  help="Enter a user's email (required)"
                  helpClassName="text-danger"
                />
                <SubmitField value="Submit" />
                <ErrorsField />
              </Card.Body>
            </Card>
            <h2 className="text-center">All Registered Users</h2>
            <Card>
              <Card.Body>
                {/* Render all users contained in the Meteor.users collection */}
                {Meteor.users.find().fetch().map(user => (
                  <div key={user._id}>{user.username}</div>
                ))}
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

export default DevTest;
