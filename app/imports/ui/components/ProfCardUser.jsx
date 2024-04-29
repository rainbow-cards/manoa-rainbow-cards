import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

/** Renders Professor Cards. See pages/ListMyCards.jsx. */
const ProfCardUser = ({ profInfo }) => {
  // Check if profInfo exists and has owners array
  if (!profInfo || !profInfo.owners || !Array.isArray(profInfo.owners)) {
    return null; // Or handle the case where profInfo or owners are not defined
  }
  const currentOwner = profInfo.owners.find(owner => owner.name === Meteor.user()?.username);
  const ownerCardCount = currentOwner ? currentOwner.count : 0;
  return (
    <Card className="h-100">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <Card.Subtitle>(x{ownerCardCount})</Card.Subtitle>
          <Card.Title>{profInfo.name}</Card.Title>
          <Card.Subtitle>{profInfo.department}</Card.Subtitle>
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
          <Card.Text>{profInfo.hiddenTalent}</Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
};

// Require a document to be passed to this component.
ProfCardUser.propTypes = {
  profInfo: PropTypes.shape({
    name: PropTypes.string,
    course: PropTypes.string,
    semester: PropTypes.string,
    department: PropTypes.string,
    email: PropTypes.string,
    image: PropTypes.string,
    facts: PropTypes.string,
    owners: PropTypes.string,
    campusEats: PropTypes.string,
    hiddenTalent: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default ProfCardUser;
