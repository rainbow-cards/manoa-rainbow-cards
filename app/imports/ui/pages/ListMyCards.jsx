import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../components/LoadingSpinner';
import { ProfCards } from '../../api/profcard/ProfCard';
import ProfCardUser from '../components/ProfCardUser';
/* Renders a table containing all the ProfCards documents. Use <StuffItem> to render each row. */
const ListMyCards = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, cards } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to ProfCards documents.
    const subscription = Meteor.subscribe(ProfCards.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the ProfCards documents
    const profCardItems = ProfCards.collection.find({}).fetch();
    return {
      cards: profCardItems,
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
            <h2>Cards Catalog</h2>
          </Col>
          <Row xs={1} md={2} lg={3} className="g-4">
            {cards.map((profInfo) => (
              <Col key={profInfo._id}>
                <Card
                  className={`prof-card ${hoveredCard === profInfo._id || selectedCard === profInfo._id ? 'highlight' : ''}`}
                  onMouseEnter={() => setHoveredCard(profInfo._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardBody style={{ backgroundColor: 'rgba(150, 200, 100, 0.3)' }}>
                    <ProfCardUser profInfo={profInfo} />
                  </CardBody>
                  {hoveredCard === profInfo._id && (
                    <Card.Footer className="text-center prof-card-footer">
                      <Button
                        variant={selectedCard === profInfo._id ? 'danger' : 'primary'}
                        onClick={() => handleSelectCard(profInfo._id)}
                      >
                        {selectedCard === profInfo._id ? 'Deselect' : 'Select'}
                      </Button>
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

export default ListMyCards;
