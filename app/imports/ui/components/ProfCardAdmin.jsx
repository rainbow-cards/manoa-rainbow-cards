import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image } from 'react-bootstrap';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const ProfCard = ({ profInfo }) => (
  <Card className="h-100">
    <Card.Header>
      <div className="d-flex justify-content-between align-items-center">
        <Card.Title>{profInfo.name}</Card.Title>
        <Card.Subtitle>{profInfo.department} </Card.Subtitle>
      </div>
    </Card.Header>
    <Card.Body>
      <div className="row justify-content-center">
        <div className="col-md-12 text-center">
          <Image src={profInfo.image} className="img-fluid" alt="Profile Image" />
        </div>
      </div>
      <div className="row mt-2 justify-content-center">
        <div className="col-md-12 text-center">
          <Card.Subtitle className="mb-1">{profInfo.course}, {profInfo.semester}</Card.Subtitle>
          <Card.Subtitle>{profInfo.email}</Card.Subtitle>
        </div>
        <Card.Text>{profInfo.facts}</Card.Text>
        <Card.Text>{profInfo.campusEats}</Card.Text>
        <Link to={`/edit/${profInfo._id}`}>Edit</Link>
      </div>
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
    campusEats: PropTypes,
    _id: PropTypes.string,
  }).isRequired,
};

export default ProfCard;
