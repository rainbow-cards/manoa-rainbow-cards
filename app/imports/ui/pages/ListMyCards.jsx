import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom'; // Import Link for navigation
import LoadingSpinner from '../components/LoadingSpinner';
import { ProfCards } from '../../api/profcard/ProfCard';
import ProfCardUser from '../components/ProfCardUser';

const ListMyCards = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const { ready, cards } = useTracker(() => {
    const subscription = Meteor.subscribe(ProfCards.userPublicationName, Meteor.userId());
    const rdy = subscription.ready();
    const profCardItems = ProfCards.collection.find({}).fetch();
    return {
      cards: profCardItems,
      ready: rdy,
    };
  }, []);

  const handleSelectCard = (profId) => `/trading/${profId}`;

  return (ready ? (
    <Container className="py-3 greentxt">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2>My Portfolio</h2>
          </Col>
          {cards.length === 0 ? (
            <div className="text-center">
              <div>
                You don&apos;t have any cards yet!<br />
                <Link to="/guide">&gt;&gt;Learn how to start collecting cards&lt;&lt;</Link>
              </div>
            </div>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {cards.map((profInfo) => (
                <Col key={profInfo._id}>
                  <Link to={handleSelectCard(profInfo._id)} style={{ textDecoration: 'none' }}>
                    <Card
                      className={`prof-card ${hoveredCard === profInfo._id ? 'highlight' : ''}`}
                      onMouseEnter={() => setHoveredCard(profInfo._id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <CardBody style={{ backgroundColor: 'rgba(150, 200, 100, 0.3)' }}>
                        <ProfCardUser profInfo={profInfo} />
                      </CardBody>
                      {hoveredCard === profInfo._id && (
                        <Card.Footer className="text-center prof-card-footer">
                          <Button variant="secondary" id="trade-button">Trade It!</Button>
                        </Card.Footer>
                      )}
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListMyCards;
