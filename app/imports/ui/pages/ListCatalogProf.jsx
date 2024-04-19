import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../components/LoadingSpinner';
import { ProfCards } from '../../api/profcard/ProfCard';
import ProfCardAdmin from '../components/ProfCardAdmin';

/* Renders a table containing all the ProfCards documents. Use <StuffItem> to render each row. */
const ListCatalogProf = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { profcards, ready } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to ProfCards documents.
    const subscription = Meteor.subscribe(ProfCards.professorPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the ProfCards documents
    const profCardItems = ProfCards.collection.find().fetch();
    return {
      profcards: profCardItems,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2>Cards Catalog (Professor)</h2>
          </Col>
          <Row xs={2} md={3} lg={4} className="g-4">
            {profcards.map((profInfo) => (<Col><ProfCardAdmin profInfo={profInfo} /></Col>))}
          </Row>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListCatalogProf;
