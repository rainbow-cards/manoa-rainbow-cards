import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { useTracker } from 'meteor/react-meteor-data';
import { ProfCards } from '../../api/profcard/ProfCard';
import ProfCardAdmin from '../components/ProfCardAdmin';
import LoadingSpinner from '../components/LoadingSpinner';

/* Renders a table containing all the ProfCards documents. Use <StuffItem> to render each row. */
const ListCatalogAdmin = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { profcards, allusers, ready } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to ProfCards documents.
    const subscription = Meteor.subscribe('cards.public');
    const subscriptionUsers = Meteor.subscribe('allUsernames');
    const profCardItems = ProfCards.collection.find().fetch();
    const users = Meteor.users.find().fetch(); // Fetch all users
    return {
      profcards: profCardItems,
      allusers: users,
      ready: subscription.ready() && subscriptionUsers.ready(), // Ensure both subscriptions are ready
    };
  });

  const bridge = new SimpleSchema2Bridge(new SimpleSchema({
    user: { label: 'Send Rainbow Cards to:', type: String },
  }));

  const handleSelectCard = (profId) => {
    setSelectedCard(profId === selectedCard ? null : profId);
  };
  const submit = (formData, formRef) => {
    const { user } = formData;

    // Check if the subscription is ready
    if (!ready) {
      swal('Error', 'Subscriptions not ready... Please reload and try again.', 'error');
      return;
    }

    if (!selectedCard) {
      swal('Error', 'Please select a Rainbow Card below.', 'error');
      return;
    }

    // Find the selected card from the profcards array
    const selectedCardInfo = profcards.find((profInfo) => profInfo._id === selectedCard);
    if (!selectedCardInfo) {
      swal('Error', 'Selected card not found in the database.', 'error');
      return;
    }

    // Find the target user by their username
    const targetUser = Meteor.users.findOne({ username: user });
    if (!targetUser) {
      swal('Error', `User ${user} not found`, 'error');
      return;
    }

    console.log(`Targeting ${user} to give ${selectedCardInfo.name} card`);
    const options = { arrayFilters: [{ 'elem.name': user }] };
    // Insert a copy of the selected card into the ProfCards collection
    if (selectedCardInfo.owners.find(o => o.name === user) === undefined) {
      ProfCards.collection.update({ _id: selectedCardInfo._id }, {
        $addToSet: {
          owners: { name: user, count: 1 },
        },
      }, (error) => {
        if (error) {
          swal('Error', 'Failed to send card...', 'error');
          console.log(error);
        } else {
          swal('Success', `${selectedCardInfo.name} Card sent to ${user} successfully!`, 'success');
          formRef.reset();
        }
      });
    } else {
      ProfCards.collection.update({ _id: selectedCardInfo._id }, {
        $inc: {
          'owners.$[elem].count': 1,
        },
      }, options, (error) => {
        if (error) {
          swal('Error', 'Failed to send card...', 'error');
          console.log(error);
        } else {
          swal('Success', `${selectedCardInfo.name} Card sent to ${user} successfully!`, 'success');
          formRef.reset();
        }
      });
    }
  };

  let fRef = null; // Reference for the AutoForm

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Col>
            <h2 className="text-center">Cards Catalog (Admin)</h2>
            <div>
              This page shows all of the Rainbow Cards associated with <b>{Meteor.user()?.username}</b>.
              <br />
              <br />
              By mousing over a Rainbow Card, you can: <br />
              <ul>
                <li>send copies of a Rainbow Card to other accounts</li>
                <li>update its details by clicking the <i>Edit</i> button</li>
              </ul>
              To distribute a Rainbow Card to another account, select a card, enter the account&apos;s username below, then click the <i>Submit</i> button.
              <br />
              <br />
            </div>
            <Row>
              <h2 className="text-center">Distribute Form</h2>
              <Col>
                <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={(data) => submit(data, fRef)}>
                  <Card style={{ minHeight: '178px' }}>
                    <Card.Body>
                      <TextField
                        id="enterUser"
                        name="user"
                        placeholder="Enter a user here..."
                        showInlineError
                        helpClassName="text-danger"
                      />
                      <SubmitField id="submit" value="Submit" />
                      <ErrorsField />
                    </Card.Body>
                  </Card>
                </AutoForm>
              </Col>
              <Col>
                <Card style={{ minHeight: '178px', maxHeight: '178px', overflowY: 'auto' }}>
                  <Card.Header>
                    <h5 className="text-center">All Registered Users</h5>
                    <div className="text-center" style={{ color: 'gray' }}>
                      Scroll to view more.
                    </div>
                  </Card.Header>
                  <Card.Body>
                    {/* Render all users contained in the Meteor.users collection */}
                    {allusers.map(user => (
                      <div key={user._id}>{user.username}</div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col className="text-center">
            <br />
            <h3>All Rainbow Cards</h3>
          </Col>
          <Row xs={1} md={2} lg={3} className="g-4">
            {profcards.map((profInfo) => (
              <Col key={profInfo._id}>
                <Card
                  className={`prof-card ${hoveredCard === profInfo._id || selectedCard === profInfo._id ? 'highlight' : ''}`}
                  onMouseEnter={() => setHoveredCard(profInfo._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardBody style={{ backgroundColor: 'rgba(150, 200, 100, 0.3)' }}>
                    <ProfCardAdmin profInfo={profInfo} />
                  </CardBody>
                  {hoveredCard === profInfo._id && (
                    <Card.Footer className="text-center prof-card-footer">
                      <Button
                        variant={selectedCard === profInfo._id ? 'danger' : 'primary'}
                        onClick={() => handleSelectCard(profInfo._id)}
                      >
                        {selectedCard === profInfo._id ? 'Deselect' : 'Select'}
                      </Button>
                      <Link id="admin-edit-link" to={`/edit/${profInfo._id}`}>
                        <Button variant="secondary">Edit</Button>
                      </Link>
                    </Card.Footer>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListCatalogAdmin;
