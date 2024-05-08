import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Row, Col, ListGroup, Card, CardBody, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfCard from '../components/ProfCard';
import { ProfCards } from '../../api/profcard/ProfCard';

const ListCatalogUser = () => {
  // Get the userId from the URL params
  const targetUser = useParams();

  // State variables
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [wishlistedCards, setWishlistedCards] = useState([]);

  // Function to handle department click
  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department === selectedDepartment ? null : department);
  };

  // Fetch data using useTracker hook
  const { profcards, ready, departments, searchedUsername } = useTracker(() => {
    // Subscribe to the publication for user's cards
    const subscription = Meteor.subscribe(ProfCards.userPublicationName, targetUser.userId);
    const rdy = subscription.ready();

    // Fetch all profCards
    const profCardItems = ProfCards.collection.find({}).fetch();

    // Extract unique departments
    const uniqueDepartments = Array.from(new Set(profCardItems.map(card => card.department)));

    // Find the searched user
    const user = Meteor.users.findOne(targetUser.userId);

    // Return the data
    return {
      profcards: selectedDepartment ? profCardItems.filter(card => card.department === selectedDepartment) : profCardItems,
      ready: rdy,
      departments: uniqueDepartments,
      searchedUsername: user ? user.username : '',
    };
  }, [selectedDepartment, targetUser.userId]);

  const isWished = (profId) => wishlistedCards.includes(profId);
  // Function to handle card selection
  const handleSelectCard = (profId) => {
    setSelectedCard(profId === selectedCard ? null : profId);
    setWishlistedCards(prevState => [...prevState, profId]);
    ProfCards.collection.update({ _id: profId }, { $addToSet: { wished: Meteor.user()?.username } });
  };

  const handleKeyDown = (event, profId) => {
    // If Enter key is pressed, wishlist the card
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default form submission behavior
      handleSelectCard(profId); // Call the handleSelectCard function to wishlist the card
    }
  };

  const isLogged = Meteor.userId() !== null;

  // Return loading spinner while data is loading
  return (ready ? (
    <Container className="py-3">
      <Col className="text-center">
        {/* Display user's profile name or default header */}
        <h2>{searchedUsername ? `${searchedUsername}'s Portfolio` : 'Rainbow Catalog'}</h2>
      </Col>
      <Row>
        <Col xs={3} md={2}>
          {/* Department filter list */}
          <ListGroup>
            <ListGroup.Item className="text-align-left" style={{ fontSize: '16px' }}>
              <h2 style={{ fontSize: '16px' }}>Filter by Department</h2>
            </ListGroup.Item>
            {/* Render department items */}
            {departments.map(department => (
              <ListGroup.Item
                key={department}
                action
                variant={selectedDepartment === department ? 'primary' : 'light'}
                onClick={() => handleDepartmentClick(department)}
                style={{ fontSize: '12px' }}
              >
                {department}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col>
          {/* Render profCards */}
          <Row xs={1} md={2} lg={3} className="g-4">
            {profcards.map((profInfo) => (
              <Col key={profInfo._id}>
                <Card
                  className={`prof-card ${hoveredCard === profInfo._id || selectedCard === profInfo._id ? 'highlight' : ''}`}
                  onMouseEnter={() => setHoveredCard(profInfo._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onKeyDown={(event) => handleKeyDown(event, profInfo._id)}
                  tabIndex="0" // Make the card focusable
                >
                  <CardBody style={{ backgroundColor: 'rgba(150, 200, 100, 0.3)' }}>
                    <ProfCard profInfo={profInfo} />
                  </CardBody>
                  {hoveredCard === profInfo._id && (
                    <Card.Footer className="text-center prof-card-footer">
                      {/* Wishlist button */}
                      {isLogged && !isWished(profInfo._id) && (
                        <Button
                          variant={selectedCard === profInfo._id ? 'danger' : 'primary'}
                          onClick={() => handleSelectCard(profInfo._id)}
                        >
                          {selectedCard === profInfo._id ? 'Un-wishlist' : 'Wishlist'}
                        </Button>
                      )}
                      {/* "Wishlisted" message */}
                      {isLogged && isWished(profInfo._id) && (
                        <Button variant="success" disabled>
                          Wishlisted!
                        </Button>
                      )}
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
export default ListCatalogUser;
