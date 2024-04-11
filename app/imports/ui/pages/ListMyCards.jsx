import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../components/LoadingSpinner';
import { ProfCards } from '../../api/profcard/ProfCard';
import ProfCard from '../components/ProfCard';

/* Renders a table containing all the ProfCards documents. Use <StuffItem> to render each row. */
const ListMyCards = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to ProfCards documents.
    const subscription = Meteor.subscribe('cards.public');
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the ProfCards documents
    const profCardItems = ProfCards.collection.find({}).fetch();
    return {
      profCard: profCardItems,
      ready: rdy,
    };
  }, []);
  const myCards = [{
    name: 'Philip Johnson', class: 'ICS314', semester: 'Fall', department: 'ICS', email: 'pjohnson@hawaii.edu',
    image: 'https://github.com/philipmjohnson.png',
    facts: 'I am a Professor of Information and Computer Sciences at the University of Hawaii, Director ' +
      'of the Collaborative Software Development Laboratory, and the CEO of OpenPowerQuality.com.',
  },
  {
    name: 'Henri Casanova', class: 'ICS111', semester: 'Fall', department: 'ICS', email: 'pjohnson@hawaii.edu',
    image: 'https://avatars0.githubusercontent.com/u/7494478?s=460&v=4',
    facts: 'I am a Professor of Information and Computer Sciences at the University of Hawaii, Director ' +
        'of the Collaborative Software Development Laboratory, and the CEO of OpenPowerQuality.com.',
  },
  {
    name: 'Kim Binsted', class: 'ICS212', semester: 'Spring', department: 'ICS', email: 'pjohnson@hawaii.edu',
    image: 'https://www.ics.hawaii.edu/wp-content/uploads/2013/08/kim_binsted-square-300x300.jpg',
    facts: 'I am a Professor of Information and Computer Sciences at the University of Hawaii, Director ' +
        'of the Collaborative Software Development Laboratory, and the CEO of OpenPowerQuality.com.',
  },
  {
    name: 'Kim Binsted', class: 'ICS212', semester: 'Spring', department: 'ICS', email: 'pjohnson@hawaii.edu',
    image: 'https://www.ics.hawaii.edu/wp-content/uploads/2013/08/kim_binsted-square-300x300.jpg',
    facts: 'I am a Professor of Information and Computer Sciences at the University of Hawaii, Director ' +
        'of the Collaborative Software Development Laboratory, and the CEO of OpenPowerQuality.com.',
  },
  ];

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2>My Cards</h2>
          </Col>
          <Row xs={2} md={3} lg={4} className="g-4">
            {myCards.map((profInfo, index) => (<Col key={index}><ProfCard profInfo={profInfo} /></Col>))}

          </Row>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListMyCards;
