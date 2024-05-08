import React, { useState, useRef, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { CheckSquareFill } from 'react-bootstrap-icons'; // Import the CheckSquareFill icon
import { Col, Container, Row, Button, Card, CardBody } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../components/LoadingSpinner';
import { ProfCards } from '../../api/profcard/ProfCard';
import ProfCardAdmin from '../components/ProfCardAdmin';

const ListCatalogProf = () => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const cardRefs = useRef([]); // Ref to store card elements

  const { profcards, allusers, ready } = useTracker(() => {
    const subscriptionProfCards = Meteor.subscribe(ProfCards.professorPublicationName);
    const subscriptionUsers = Meteor.subscribe('allUsernamesForProfessors');
    const profCardItems = ProfCards.collection.find().fetch();
    const users = Meteor.users.find().fetch(); // Fetch all users
    return {
      profcards: profCardItems,
      allusers: users,
      ready: subscriptionProfCards.ready() && subscriptionUsers.ready(), // Ensure both subscriptions are ready
    };
  });

  const bridge = new SimpleSchema2Bridge(new SimpleSchema({
    user: { label: 'Send Rainbow Cards to:', type: String },
  }));

  // Function to handle card selection
  const handleSelectCard = (profId) => {
    setSelectedCards(prevSelected => {
      if (prevSelected.includes(profId)) {
        return prevSelected.filter(id => id !== profId);
      }
      return [...prevSelected, profId];
    });
  };

  // Function to handle form submission
  const submit = (formData, formRef) => {
    const { user } = formData;

    if (!ready) {
      swal('Error', 'Subscriptions not ready... Please reload and try again.', 'error');
      return;
    }

    if (selectedCards.length === 0) {
      swal('Error', 'Please select at least one Rainbow Card below.', 'error');
      return;
    }

    const targetUser = Meteor.users.findOne({ username: user });
    if (!targetUser) {
      swal('Error', `User ${user} not found`, 'error');
      return;
    }

    selectedCards.forEach(selectedCard => {
      const selectedCardInfo = profcards.find((profInfo) => profInfo._id === selectedCard);
      if (!selectedCardInfo) {
        swal('Error', 'Selected card not found in the database.', 'error');
        return;
      }

      console.log(`Targeting ${user} to give ${selectedCardInfo.name} card`);
      const options = { arrayFilters: [{ 'elem.name': user }] };

      if (selectedCardInfo.owners.find(o => o.name === user) === undefined) {
        ProfCards.collection.update({ _id: selectedCardInfo._id }, {
          $addToSet: { owners: { name: user, count: 1 } },
        }, (error) => {
          if (error) {
            swal('Error', 'Failed to send card...', 'error');
            console.log(error);
          } else {
            swal('Success', `Sent to ${user} successfully!`, 'success');
            formRef.reset();
          }
        });
      } else {
        ProfCards.collection.update({ _id: selectedCardInfo._id }, {
          $inc: { 'owners.$[elem].count': 1 },
        }, options, (error) => {
          if (error) {
            swal('Error', 'Failed to send card...', 'error');
            console.log(error);
          } else {
            swal('Success', `Sent to ${user} successfully!`, 'success');
            formRef.reset();
          }
        });
      }
    });
  };

  // Function to handle keyboard events on cards
  const handleCardKeyDown = (event, profId) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSelectCard(profId);
    }
  };

  useEffect(() => {
    // Focus the first card when the component mounts
    if (cardRefs.current.length > 0) {
      cardRefs.current[0].focus();
    }
  }, [ready]); // Ensure this effect runs when the data is ready
  let fRef = null; // Reference for the AutoForm

  return (
    ready ? (
      <Container className="py-3">
        <h2 className="text-center">My Cards Portal</h2>
        <Row className="justify-content-center">
          <Col>
            <Col>
              <div>
                This page shows all of the Rainbow Cards associated with <b>{Meteor.user()?.username}</b>.
                <br />
                <br />
                By mousing over a Rainbow Card, you can: <br />
                <ul>
                  <li>send copies of a Rainbow Card to other accounts</li>
                  <li>update its details by clicking the <i>Edit</i> button</li>
                </ul>
                To distribute a Rainbow Card to a student, select a card, enter the student&apos;s username below, then click the <i>Submit</i> button.
                <br />
                <br />
              </div>
              <Row>
                <h2 className="text-center">Distribute Form</h2>
                <Col>
                  <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={(data) => submit(data, fRef)}>
                    <Card style={{ minHeight: '175px' }}>
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
                  <Card style={{ minHeight: '175px', maxHeight: '175px', overflowY: 'auto' }}>
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
              <h3>My Rainbow Cards</h3>
            </Col>
            <Row xs={1} md={2} lg={3} className="g-4">
              {profcards.map((profInfo, index) => (
                <Col key={profInfo._id}>
                  <Card
                    ref={ref => { cardRefs.current[index] = ref; }} // Assign ref to the card
                    className={`prof-card ${hoveredCard === profInfo._id || selectedCards.includes(profInfo._id) ? 'highlight' : ''}`}
                    onMouseEnter={() => setHoveredCard(profInfo._id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => handleSelectCard(profInfo._id)}
                    onKeyDown={(event) => handleCardKeyDown(event, profInfo._id)} // Handle keydown event
                    tabIndex="0" // Make the card focusable
                  >
                    <CardBody style={{ position: 'relative', backgroundColor: 'rgba(150, 200, 100, 0.3)' }}>
                      <ProfCardAdmin profInfo={profInfo} />
                      {selectedCards.includes(profInfo._id) && (
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1, backgroundColor: 'white', borderRadius: '20%', opacity: '90%' }}>
                          <CheckSquareFill color="green" size={48} />
                        </div>
                      )}
                    </CardBody>
                    {hoveredCard === profInfo._id && (
                      <Card.Footer className="text-center prof-card-footer">
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
    ) : <LoadingSpinner />
  );
};

export default ListCatalogProf;
