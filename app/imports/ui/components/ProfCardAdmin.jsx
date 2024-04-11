import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const ProfCard = ({ profInfo }) => (
  <Card className="h-100">
    <Card.Header>
      <Card.Title>{profInfo.name}</Card.Title>
      <Card.Subtitle>{profInfo.course}, {profInfo.semester}</Card.Subtitle>
      <Card.Subtitle>{profInfo.department} {profInfo.email}</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      <Image src={profInfo.image} width={250} />
      <Card.Text>{profInfo.facts}</Card.Text>
      <Link to={`/edit/${profInfo._id}`}>Edit</Link>
    </Card.Body>
  </Card>
);

// Require a document to be passed to this component.
ProfCard.propTypes = {
  profInfo: PropTypes.shape({
    name: PropTypes.string,
    course: PropTypes.string,
    semester: PropTypes.string,
    department: PropTypes.string,
    email: PropTypes.string,
    image: PropTypes.string,
    facts: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default ProfCard;
