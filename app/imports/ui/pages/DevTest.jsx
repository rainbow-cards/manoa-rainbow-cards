import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField, SelectField } from 'uniforms-bootstrap5';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { ProfCards } from '../../api/profcard/ProfCard';
import LoadingSpinner from '../components/LoadingSpinner';

const DevTest = () => {
  const { profcards, ready } = useTracker(() => {
    const subscription = Meteor.subscribe('cards.public');
    const subscriptionUsernames = Meteor.subscribe('allUsernames');
    const subscriptionMyCards = Meteor.subscribe(ProfCards.userPublicationName);

    const rdy = subscription.ready() && subscriptionUsernames.ready() && subscriptionMyCards.ready();

    const profCardItems = ProfCards.collection.find().fetch();
    return {
      profcards: profCardItems,
      ready: rdy,
    };
  }, []);

  const emptySchema = new SimpleSchema({
    placeholderField: { type: String, optional: true }, // Adding a dummy field
  });
  const bridge = new SimpleSchema2Bridge(new SimpleSchema({
    card: { label: 'Select a card', type: String, allowedValues: profcards.map(card => `${card.name} (${card.semester}, ${card.course})`) },
    user: { label: 'Enter a user', type: String },
  }));

  const submit = (formData, formRef) => {
    const { card, user } = formData;

    console.log('Selected card:', card);
    console.log('All profcards:', profcards);

    if (!profcards || profcards.length === 0) {
      swal('Error', 'No Rainbow Cards registered...!', 'error');
      return;
    }

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
    console.log('Found card:', selectedCard);

    if (!selectedCard) {
      swal('Error', 'Card not found in the database...', 'error');
      return;
    }

    // Find the user by their username
    const targetUser = Meteor.users.findOne({ username: user });

    console.log('Target user:', targetUser);
    console.log(`Adding card to ${targetUser.username}`);

    if (!targetUser) {
      swal('Error', `User ${user} not found`, 'error');
      return;
    }

    // Access the user's collection based on the subscription
    const userPublicationName = `${ProfCards.userPublicationName}.${targetUser.username}`;
    console.log('User publication name:', userPublicationName);
    const userCollection = new Mongo.Collection(userPublicationName);

    // Add the selected card to the user's cards array
    const userData = userCollection.findOne({ username: user });
    const currentCards = userData ? userData.cards || [] : [];
    console.log('Current cards: ', currentCards);
    const updatedCards = [...currentCards, selectedCard];
    console.log('Updated cards: ', updatedCards);

    // Upsert the user's document in the collection
    userCollection.upsert({ username: user }, { $set: { cards: updatedCards } }, (error) => {
      if (error) {
        console.error('Error:', error);
        swal('Error', 'Failed to add card to user...', 'error');
      } else {
        // If the upsert is successful, display success message
        swal('Success', 'Card added to user successfully', 'success')
          .then(() => {
            // After user acknowledges success message, reset the form
            formRef.reset();
          });
      }
    });
  };
  const submit2 = () => {
    // Get the first ProfCard from the ProfCards collection
    const firstProfCard = profcards.find(card => card.name === 'Moore Carleton');
    console.log(`Found: ${firstProfCard.name}`);

    if (firstProfCard) {
      // Find the user by their username
      const targetUser = Meteor.users.findOne({ username: 'doge' });

      if (targetUser) {
        // Access the user's collection
        const userCollectionName = `${ProfCards.userPublicationName}.${targetUser.username}`;
        console.log('User collection name:', userCollectionName);

        // Attempt to access doge's collection
        const userCollection = Meteor.connection._mongo_livedata_collections[userCollectionName];
        console.log('User collection:', userCollection);

        // Insert the first ProfCard into the user's collection if it exists
        if (userCollection) {
          userCollection.insert(firstProfCard, (error) => {
            if (error) {
              console.error('Error:', error);
              swal('Error', 'Failed to add card to doge...', 'error');
            } else {
              swal('Success', 'Cam Moore card added to doge successfully!', 'success');
            }
          });
        } else {
          swal('Error', `User collection "${userCollectionName}" not found`, 'error');
        }
      } else {
        swal('Error', 'User "doge" not found', 'error');
      }
    } else {
      swal('Error', 'No ProfCards available...', 'error');
    }
  };

  const submit3 = () => {
    const userPublicationName = `${ProfCards.userPublicationName}.doge`;
    console.log('User publication name:', userPublicationName);
    const userCollection = new Mongo.Collection(userPublicationName);
    console.log('doge collection:', userCollection);
  };
  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null; // Reference for the first AutoForm
  return (ready ? (
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
                  // help="Select a Rainbow Card (required)"
                  helpClassName="text-danger"
                />
                <TextField
                  name="user"
                  showInlineError
                  // help="Enter a user's email (required)"
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
          <h2 className="text-center">doge</h2>
          <Card className="align-items-center">
            <Card.Body>
              <Row>
                <Button className="btn btn-primary" onClick={submit3}>Create Collection</Button>
                <Button className="btn btn-primary" onClick={submit2}>Auto-Add</Button>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default DevTest;
