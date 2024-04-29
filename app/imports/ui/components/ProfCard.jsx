import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image } from 'react-bootstrap';

/** Renders Professor Cards. See pages/ListMyCards.jsx. */
const ProfCard = ({ profInfo }) => {
  // Check if profInfo exists and has owners array
  if (!profInfo || !profInfo.owners || !Array.isArray(profInfo.owners)) {
    return null; // Or handle the case where profInfo or owners are not defined
  }

  // adjust font size based on name length
  const getFontSize = (name) => {
    if (name.length < 20) {
      return '1.2rem'; // Default font size
    }
    return '1.1rem'; // Decrease font size for longer names
  };

  return (
    <Card className="h-100 prof-card-master">
      <Card.Header>
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ minHeight: '50px' }}
        >
          <Card.Title style={{ fontSize: getFontSize(profInfo.name) }}>
            {profInfo.name}
          </Card.Title>
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
        </div>
      </Card.Body>
    </Card>
  );
};

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
    owners: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })),
    campusEats: PropTypes.string,
    hiddenTalent: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default ProfCard;
