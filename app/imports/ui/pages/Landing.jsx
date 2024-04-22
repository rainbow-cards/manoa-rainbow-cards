import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { ProfCards } from '../../api/profcard/ProfCard';
import ProfCard from '../components/ProfCard';

const Landing = () => {
  const [featuredCard, setFeaturedCard] = useState(null);

  const selectRandomCard = (cardList) => {
    const randomIndex = Math.floor(Math.random() * cardList.length);
    return cardList[randomIndex];
  };

  useTracker(() => {
    // eslint-disable-next-line no-unused-vars
    const subscription = Meteor.subscribe('cards.public');
    const profCardItems = ProfCards.collection.find().fetch();
    if (profCardItems.length > 0) {
      const randomCard = selectRandomCard(profCardItems);
      setFeaturedCard(randomCard);
    }
  }, []);

  useEffect(() => {
    const handle = Meteor.subscribe('cards.public');
    return () => handle.stop();
  }, []);

  return (
    <Container id="landing-page" fluid className="py-3">
      <Row className="align-middle text-center">
        <Col xs={4}>
          <Image roundedCircle src="/images/rainbow-cards-icon.png" width="200px" />
        </Col>

        <Col className="d-flex flex-column justify-content-center align-items-center greentxt">
          <h1 className="font-effect-fire-animation" id="landing-title">Mānoa<br />Rainbow Cards</h1>
          {/* eslint-disable-next-line max-len */}
          <p>Rainbow Cards is a card collection site where you can collect the cards of your favorite professors. Each card includes information and fun facts about the professor. Aim to collect a variety of cards and trade them for your desired cards with other users!</p>
          <Button id="sign-up-button" as={NavLink} to="/signup" key="signup">Get Started</Button>
          <br />
          <p>Want to contribute? <a href="https://forms.gle/RJjyfaoXvakZ6eQNA">Opt-In Form for Professors</a></p>
        </Col>

        <Col xs={4}>
          <Image roundedCircle src="/images/rainbow-cards-icon.png" width="200px" />
        </Col>
      </Row>
      <Row className="align-middle text-center">
        <Col className="d-flex flex-column justify-content-center greentxt">
          <h2> Featured Card: </h2>
        </Col>
      </Row>
      <Row className="align-items-center text-center">
        <Col xs={12}>
          {featuredCard && (
            <div style={{ display: 'inline-block', width: '300px', height: '400px' }}>
              <ProfCard profInfo={featuredCard} />
            </div>
          )}
        </Col>
      </Row>

    </Container>
  );
};

export default Landing;
