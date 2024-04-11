import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfCards from '../components/ProfCards';

/* Renders a table containing all the Stuff documents. Use <StuffItem> to render each row. */
const ListCatalog = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { profcard, ready } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe('cards.public');
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const profCardItems = ProfCards.collection.find({}).fetch();
    return {
      profcard: profCardItems,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2>Card Catalog</h2>
          </Col>
          <Row xs={2} md={3} lg={4} className="g-4">
            {profcard.map((profInfo, index) => (<Col key={index}><ProfCards profInfo={profInfo} /></Col>))}
          </Row>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListCatalog;
