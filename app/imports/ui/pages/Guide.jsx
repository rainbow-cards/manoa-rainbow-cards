import React from 'react';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import { useTracker } from 'meteor/react-meteor-data';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import { ProfCards } from '../../api/profcard/ProfCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Guide = () => {
  const { ready } = useTracker(() => {
    const subscription = Meteor.subscribe('cards.public');
    const rdy = subscription.ready();
    return {
      ready: rdy,
    };
  });

  const handleButtonClick = () => {
    const devCard = ProfCards.collection.findOne({ name: 'Elijah Myles Saloma' });
    const name = Meteor.user().username;
    ProfCards.collection.update({ _id: devCard._id }, {
      $addToSet: {
        owners: { name: name, count: 1 },
      },
    }, (error) => {
      if (error) {
        swal('Error', 'Failed to add card...', 'error');
      } else {
        swal('Success', `${devCard.name} Card added to ${name}'s cards successfully!`, 'success');
      }
    });
  };

  return (ready ? (
    <Container className="my-3 py-3 align-content-center guide-container">
      <Col className="text-center">
        <h2 className="greentxt">Guide</h2>
      </Col>
      <Row className="text-center guide-container-body">
        <Col className="text-center px-4" md={3}>
          <Image src="/images/rainbow-cards-logo.png" width="300" />
        </Col>
        <Col className="px-4 text-start" md={9}>
          <p>Welcome to Manoa Rainbow Cards!</p>
          {/* eslint-disable-next-line max-len */}
          <p>This website is all about promoting engagement with the UH Manoa community by, well, trading cards! Each card represents a professor, a course, and the respective semester. However, once you obtain a card, you will have the chance to learn far more about your favorite professors!</p>
        </Col>
      </Row>
      <br /><br />
      <Row className="text-center guide-container-body">
        <Col className="px-4 text-start" md={9}>
          <p>Once you create an account, you can explore the catalog of existing professor cards, filter by department, and wishlist the cards you want. You may also search up the profiles of users you know and look at their cards!</p>
          {/* eslint-disable-next-line max-len */}
          <p>If you see a card that you want that someone else wishes to give or has multiple copies of, no worries! Using the trading page, you can type in a user and select a card and, with just a few clicks, immediately send the card to anyone you wish!</p>
        </Col>
        <Col className="text-center px-4" md={3}>
          <Image src="/images/rainbow-cards-catalog.png" width="300" />
        </Col>
      </Row>
      <br /><br />
      <Row className="text-center guide-container-body">
        <Col className="px-4 text-center">
          {/* eslint-disable-next-line max-len */}
          <p>The only current way to get cards is for your professor or an admin to distribute the cards to you. This may happen at the beginning of a given semester, but if you want a card now, no worries! If you press the button at the bottom, you can get a special developer card now!</p>
        </Col>
      </Row>
      <Col className="text-center">
        <Button id="dev-card" variant="primary" onClick={() => handleButtonClick()}>
          Get Dev Card!
        </Button>
      </Col>
    </Container>
  ) : <LoadingSpinner />);
};

export default Guide;
