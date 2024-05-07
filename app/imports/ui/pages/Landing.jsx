import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
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

  const isLogged = Meteor.userId() !== null;

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
    <Container id="landing-page" fluid className="py-5">
      <Row className="align-middle text-center">
        <Col xs={{ order: 'last', xs: 12, md: 6 }} md={{ order: 'first', xs: 12, md: 6 }} className="d-flex flex-column justify-content-center align-items-center greentxt" style={{ paddingLeft: '120px' }}>
          <h1 className id="landing-title">Mānoa<br />Rainbow Cards</h1>
          {/* eslint-disable-next-line max-len */}
          <p>Rainbow Cards is a card collection site where you can collect the cards of your favorite professors. Each card includes information and fun facts about the professor. Aim to collect a variety of cards and trade them for your desired cards with other users!</p>
          {!isLogged && (
            <Button id="sign-up-button" as={NavLink} to="/signup" key="signup">Get Started</Button>
          )}
          <br />
          <p>Want to contribute? <a href="https://forms.gle/RJjyfaoXvakZ6eQNA">Opt-In Form for Professors</a></p>
        </Col>
        <Col xs={12} md={6} className="d-flex flex-column justify-content-center greentxt" style={{ paddingLeft: '1px' }}>
          <div className="text-right" style={{ paddingBottom: '60px' }}>
            <h2>Featured Card:</h2>
            {featuredCard && (
              <div style={{ display: 'inline-block', width: '300px', height: '330px' }}>
                <ProfCard profInfo={featuredCard} />
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );

};

export default Landing;
