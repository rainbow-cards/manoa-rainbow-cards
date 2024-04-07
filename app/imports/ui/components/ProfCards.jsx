import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image } from 'react-bootstrap';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const ProfCards = ({ profInfo }) => (
  <Card className="h-100">
    <Card.Header>
      <Card.Title>{profInfo.name}</Card.Title>
      <Card.Subtitle>{profInfo.class}, {profInfo.semester}</Card.Subtitle>
      <Card.Subtitle>{profInfo.department} {profInfo.email}</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      <Image src={profInfo.image} width={75} />
      <Card.Text>{profInfo.facts}</Card.Text>
    </Card.Body>
  </Card>
);

// Require a document to be passed to this component.
ProfCards.propTypes = {
  profInfo: PropTypes.shape({
    name: PropTypes.string,
    class: PropTypes.string,
    semester: PropTypes.string,
    department: PropTypes.string,
    email: PropTypes.string,
    image: PropTypes.string,
    facts: PropTypes.string,
  }).isRequired,
};

export default ProfCards;
