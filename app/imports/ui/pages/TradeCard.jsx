import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField, SelectField } from 'uniforms-bootstrap5';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { ProfCards } from '../../api/profcard/ProfCard';
import LoadingSpinner from '../components/LoadingSpinner';

const TradeCard = () => {
  const { profcards, ready } = useTracker(() => {
    const subscription = Meteor.subscribe(ProfCards.userPublicationName, Meteor.user()._id);
    const subscriptionUsernames = Meteor.subscribe('allUsernames');

    const rdy = subscription.ready() && subscriptionUsernames.ready();

    const profCardItems = ProfCards.collection.find().fetch();
    return {
      profcards: profCardItems,
      ready: rdy,
    };
  }, []);

  const bridge = new SimpleSchema2Bridge(new SimpleSchema({
    card: { label: 'Select a card', type: String, allowedValues: profcards.map(card => `${card.name} (${card.semester}, ${card.course})`) },
    user: { label: 'Enter a user', type: String },
  }));

  const decrementCardCount = (card) => {
    const currentUser = Meteor.user().username;
    const options = { arrayFilters: [{ 'elem.name': currentUser }] };
    console.log('before the storm');
    if (card.owners.find((element) => element.name === currentUser).count > 1) {
      ProfCards.collection.update({ _id: card._id }, {
        $inc: {
          'owners.$[elem].count': -1,
        },
      }, options);
      console.log('decremented count');
    } else {
      ProfCards.collection.update({ _id: card._id }, {
        $pull: {
          owners: { name: currentUser, count: 1 },
        },
      });
      console.log('removed card');
    }
  };
  const submit = (formData, formRef) => {
    const { card, user } = formData;

    // Check if the subscription is ready
    if (!ready) {
      swal('Error', 'Subscriptions not ready...', 'error');
      return;
    }

    // Find the selected card from the profcards array
    const selectedCard = profcards.find(({ name, semester, course }) => {
      const regex = /(.+) \((.+), (.+)\)/; // Regex to extract name, semester, and course from the selected card string
      const [, cardName, cardSemester, cardCourse] = card.match(regex);
      console.log(`Searching profcards with the following queries: ${cardName}, ${cardSemester}, ${cardCourse}`);
      return name === cardName && semester === cardSemester && course === cardCourse;
    });

    if (!selectedCard) {
      swal('Error', 'Card not found in the database...', 'error');
      return;
    }
    // console.log(selectedCard);
    // Find the target user by their username
    const targetUser = Meteor.users.findOne({ username: user });

    if (!targetUser) {
      swal('Error', `User ${user} not found`, 'error');
      return;
    }
    console.log(`Targeting ${user} to give ${selectedCard.name} card`);
    console.log('Selected card:', selectedCard);
    console.log('Owners of card:');
    try {
      selectedCard.owners.forEach(owner => {
        console.log(owner.name);
      });
    } catch (error) {
      console.error('Error accessing owner name:', error);
    }
    const options = { arrayFilters: [{ 'elem.name': user }] };
    // Insert a copy of the selected card into the ProfCards collection
    try {
      if (selectedCard.owners.find(o => o.name === user) === undefined) {
        console.log('Checkpoint A');
        ProfCards.collection.update({ _id: selectedCard._id }, {
          $addToSet: {
            owners: { name: user, count: 1 },
          },
        }, (error) => {
          if (error) {
            swal('Error', 'Failed to send card...', 'error');
            console.log(error);
          } else {
            swal('Success', `${selectedCard.name} Card sent to ${user} successfully!`, 'success');
            formRef.reset();
          }
        });
        decrementCardCount(selectedCard);
      } else {
        console.log('Checkpoint B');
        ProfCards.collection.update({ _id: selectedCard._id }, {
          $inc: {
            'owners.$[elem].count': 1,
          },
        }, options, (error) => {
          if (error) {
            swal('Error', 'Failed to send card...', 'error');
            console.log(error);
          } else {
            swal('Success', `${selectedCard.name} Card sent to ${user} successfully!`, 'success');
            formRef.reset();
          }
        });
        decrementCardCount(selectedCard);
      }
    } catch (error) {
      console.error('An error occurred: ', error);
    }
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null; // Reference for the first AutoForm
  return (ready ? (
    <Container className="py-3 greentxt">
      <h2 className="text-center">Trade Cards</h2>
      <p className="text-center">Or rather, send a card!</p>
      <Row className="justify-content-center">
        <Col xs={7}>
          <Col className="text-center"><h3>Send a Card</h3></Col>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Card border="success" className="bg-success-subtle greentxt">
              <Card.Body>
                <SelectField
                  id="selectField"
                  name="card"
                  showInlineError
                  // help="Select a Rainbow Card (required)"
                  helpClassName="text-danger"
                />
                <TextField
                  id="enterUser"
                  name="user"
                  showInlineError
                  // help="Enter a user's email (required)"
                  helpClassName="text-danger"
                />
                <SubmitField id="submit" value="Submit" />
                <ErrorsField />
              </Card.Body>
            </Card>
            <h3 className="text-center">All Registered Users</h3>
            <Card className="bg-success-subtle greentxt" border="success">
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
  ) : <LoadingSpinner />);
};

export default TradeCard;
