import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { ProfCards } from '../../api/profcard/ProfCard';
import ProfCard from '../components/ProfCard';

const ListMyWishlistCards = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleSelectCard = (profId) => {
    setSelectedCard(profId === selectedCard ? null : profId);
    ProfCards.collection.update({ _id: profId }, { $pull: { wished: Meteor.user()?.username } });
  };

  const handleKeyDown = (event, profId) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSelectCard(profId);
    }
  };

  const { ready, cards } = useTracker(() => {
    const subscription = Meteor.subscribe(ProfCards.userPublicationNameWish);
    const rdy = subscription.ready();
    const profCardItems = ProfCards.collection.find({}).fetch();
    return {
      cards: profCardItems,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2>My Wishlist</h2>
          </Col>
          {cards.length === 0 ? (
            <div className="text-center">
              <div>
                You don&apos;t have any cards wish listed yet!<br />
                <Link to="/guide">&gt;&gt;Learn how to wish for cards&lt;&lt;</Link>
              </div>
            </div>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {cards.map((profInfo) => (
                <Col key={profInfo._id}>
                  <Card
                    className={`prof-card ${hoveredCard === profInfo._id || selectedCard === profInfo._id ? 'highlight' : ''}`}
                    onMouseEnter={() => setHoveredCard(profInfo._id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => handleSelectCard(profInfo._id)}
                    onKeyDown={(event) => handleKeyDown(event, profInfo._id)} // Handle enter key press
                    tabIndex="0"
                  >
                    <CardBody style={{ backgroundColor: 'rgba(150, 200, 100, 0.3)' }}>
                      <ProfCard profInfo={profInfo} />
                    </CardBody>
                    {hoveredCard === profInfo._id && (
                      <Card.Footer className="text-center prof-card-footer">
                        <Button
                          variant={selectedCard === profInfo._id ? 'danger' : 'primary'}
                          onClick={() => handleSelectCard(profInfo._id)}
                        >
                          Remove from wishlist
                        </Button>
                      </Card.Footer>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListMyWishlistCards;
