import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
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

  const handleFavoriteToggle = (profCardId) => {
    // Fetch the card document from the ProfCards collection
    const card = ProfCards.collection.findOne(profCardId);

    Meteor.call('profCards.isFavorited', profCardId, Meteor.userId(), (errorIsFav, result) => {
      if (errorIsFav) {
        console.error('Error checking favorite state:', errorIsFav);
      } else if (result) {
        Meteor.call('profCards.unfavorite', profCardId, Meteor.userId(), (errorUnfav) => {
          if (errorUnfav) {
            console.error('Error unfavoriting card:', errorUnfav);
          } else {
            console.log('Unfavorited card:', card.name);
          }
        });
      } else {
        Meteor.call('profCards.favorite', profCardId, Meteor.userId(), (errorFav) => {
          if (errorFav) {
            console.error('Error favoriting card:', errorFav);
          } else {
            console.log('Favorited card:', card);
          }
        });
      }
    });
  };
  const favoriteCards = cards.filter(card => card.owners.some(owner => owner._id === Meteor.userId() && owner.favorited));
  return (ready ? (
    <Container className="py-3 greentxt">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h3 className="text-center">
              {Meteor.user()?.username}&apos;s Portfolio
            </h3>
          </Col>
          {cards.length === 0 ? (
            <div className="text-center">
              <div>
                You don&apos;t have any cards yet!<br />
                <Link to="/guide">&gt;&gt;Learn how to start collecting cards&lt;&lt;</Link>
              </div>
            </div>
          ) : (
            <div>
              {/* Render favorite cards */}
              {favoriteCards.length !== 0 && (
                <div>
                  <h3 className="text-center">
                    Favorite Cards
                  </h3>
                  <Row xs={1} md={2} lg={3} className="g-4">
                    {favoriteCards.map((profInfo) => (
                      <Col key={profInfo._id}>
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
                              <Button
                                variant="primary"
                                onClick={() => handleFavoriteToggle(profInfo._id)}
                              >
                                {profInfo.owners.some(owner => owner._id === Meteor.userId() && owner.favorited) ? 'Unfavorite' : 'Favorite'}
                              </Button>
                              <Link id="trading-nav" to="/trading">
                                <Button variant="secondary" id="trade-button">Trade It!</Button>
                              </Link>
                            </Card.Footer>
                          )}
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
              {/* Render all cards */}
              <h3 className="text-center">
                All Cards
              </h3>
              <Row xs={1} md={2} lg={3} className="g-4">
                {cards.map((profInfo) => (
                  <Col key={profInfo._id}>
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
                          <Button
                            variant="primary"
                            onClick={() => handleFavoriteToggle(profInfo._id)}
                          >
                            {profInfo.owners.some(owner => owner._id === Meteor.userId() && owner.favorited) ? 'Unfavorite' : 'Favorite'}
                          </Button>
                          <Link id="trading-nav" to="/trading">
                            <Button variant="secondary" id="trade-button">Trade It!</Button>
                          </Link>
                        </Card.Footer>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListMyCards;
