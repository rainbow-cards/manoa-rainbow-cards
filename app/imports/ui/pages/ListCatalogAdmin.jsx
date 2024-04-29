import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { ProfCards } from '../../api/profcard/ProfCard';
import ProfCardAdmin from '../components/ProfCardAdmin';
import LoadingSpinner from '../components/LoadingSpinner';

/* Renders a table containing all the ProfCards documents. Use <StuffItem> to render each row. */
const ListCatalogAdmin = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { profcards, ready } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to ProfCards documents.
    const subscription = Meteor.subscribe('cards.public');
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the ProfCards documents
    const profCardItems = ProfCards.collection.find().fetch();
    return {
      profcards: profCardItems,
      ready: rdy,
    };
  }, []);

  const handleSelectCard = (profId) => {
    setSelectedCard(profId === selectedCard ? null : profId);
  };

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2>Cards Catalog (Admin)</h2>
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
