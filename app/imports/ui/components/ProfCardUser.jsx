import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Image, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { ChevronCompactDown } from 'react-bootstrap-icons';

/** Renders Professor Cards. See pages/ListMyCards.jsx. */
const ProfCardUser = ({ profInfo }) => {
  // Check if profInfo exists and has owners array
  if (!profInfo || !profInfo.owners || !Array.isArray(profInfo.owners)) {
    return null; // Or handle the case where profInfo or owners are not defined
  }
  const currentOwner = profInfo.owners.find(owner => owner.name === Meteor.user()?.username);
  const ownerCardCount = currentOwner ? currentOwner.count : 0;
  return (
    <div className="prof-card-container">
      <Card className="h-100 prof-card-master">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <Card.Subtitle>x{ownerCardCount}</Card.Subtitle>
            <Card.Title>{profInfo.name}</Card.Title>
            <Card.Subtitle>{profInfo.department}</Card.Subtitle>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="row justify-content-center">
            <div className="col-md-12 text-center">
              <Image
                src={profInfo.image}
                className="img-fluid"
                alt="Profile Image"
                style={{ maxWidth: '200px', maxHeight: '200px' }}
              />
            </div>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-12 text-center">
              <Card.Subtitle className="mb-1">{profInfo.course}, {profInfo.semester}</Card.Subtitle>
              <Card.Subtitle>{profInfo.email}</Card.Subtitle>
            </div>
            <Card.Text>{profInfo.facts}</Card.Text>
            <Row className="justify-content-center">
              <Col style={{ maxWidth: '150px' }}>
                <Card.Subtitle>FAV FOOD<br />ON CAMPUS</Card.Subtitle>
                <Card.Text>{profInfo.campusEats}<br /></Card.Text>
              </Col>
              <Col style={{ maxWidth: '150px' }}>
                <Card.Subtitle>HOBBIES<br />& TALENTS</Card.Subtitle>
                <Card.Text>{profInfo.hiddenTalent}<br /></Card.Text>
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>
      <div className="arrow-down">
        <ChevronCompactDown />
      </div>
    </div>
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
    owners: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })),
    campusEats: PropTypes.string,
    hiddenTalent: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default ProfCardUser;
