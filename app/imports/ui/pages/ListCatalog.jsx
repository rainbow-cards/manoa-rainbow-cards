import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfCard from '../components/ProfCard';
import { ProfCards } from '../../api/profcard/ProfCard';

const ListCatalog = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department === selectedDepartment ? null : department);
  };

  const { profcards, ready, departments } = useTracker(() => {
    const subscription = Meteor.subscribe('cards.public');
    const rdy = subscription.ready();
    const profCardItems = ProfCards.collection.find().fetch();
    const uniqueDepartments = Array.from(new Set(profCardItems.map(card => card.department)));
    return {
      profcards: selectedDepartment ? profCardItems.filter(card => card.department === selectedDepartment) : profCardItems,
      ready: rdy,
      departments: uniqueDepartments,
    };
  }, [selectedDepartment]);

  return (
    <Container className="py-3">
      <Col className="text-center">
        <h2>Cards Catalog</h2>
      </Col>
      <Row>
        <Col xs={3} md={2}>
          <ListGroup>
            <ListGroup.Item className="text-align-left" style={{ fontSize: '16px' }}>
              <h2 style={{ fontSize: '16px' }}>Departments</h2>
            </ListGroup.Item>
            {departments.map(department => (
              <ListGroup.Item
                key={department}
                action
                variant={selectedDepartment === department ? 'primary' : 'light'}
                onClick={() => handleDepartmentClick(department)}
                style={{ fontSize: '12px' }}
              >
                {department}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col>
          <Row xs={2} md={3} lg={4} className="g-4">
            {ready ?
              profcards.map((profInfo) => (
                <Col key={profInfo._id}>
                  <ProfCard profInfo={profInfo} />
                </Col>
              )) : <LoadingSpinner />}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
export default ListCatalog;
