import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Row, Col, ListGroup, Card, CardBody, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfCard from '../components/ProfCard';
import { ProfCards } from '../../api/profcard/ProfCard';

const ListCatalogUser = () => {
  // Insert something for useParams, in order to implement catalog of user's card
  const targetUser = useParams();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department === selectedDepartment ? null : department);
  };

  const { profcards, ready, departments } = useTracker(() => {
    const subscription = Meteor.subscribe(ProfCards.userPublicationName, targetUser.userId);
    const rdy = subscription.ready();
    const profCardItems = ProfCards.collection.find({}).fetch();
    const uniqueDepartments = Array.from(new Set(profCardItems.map(card => card.department)));
    return {
      profcards: selectedDepartment ? profCardItems.filter(card => card.department === selectedDepartment) : profCardItems,
      ready: rdy,
      departments: uniqueDepartments,
    };
  }, [selectedDepartment]);

  const handleSelectCard = (profId) => {
    setSelectedCard(profId === selectedCard ? null : profId);
  };

  return (ready ? (
    <Container className="py-3">
      <Col className="text-center">
        <h2>Rainbow Catalog</h2>
      </Col>
      <Row>
        <Col xs={3} md={2}>
          <ListGroup>
            <ListGroup.Item className="text-align-left" style={{ fontSize: '16px' }}>
              <h2 style={{ fontSize: '16px' }}>Filter by Department</h2>
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
          <Row xs={1} md={2} lg={3} className="g-4">
            {profcards.map((profInfo) => (
              <Col key={profInfo._id}>
                <Card
                  className={`prof-card ${hoveredCard === profInfo._id || selectedCard === profInfo._id ? 'highlight' : ''}`}
                  onMouseEnter={() => setHoveredCard(profInfo._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardBody style={{ backgroundColor: 'rgba(150, 200, 100, 0.3)' }}>
                    <ProfCard profInfo={profInfo} />
                  </CardBody>
                  {hoveredCard === profInfo._id && (
                    <Card.Footer className="text-center prof-card-footer">
                      <Button
                        variant={selectedCard === profInfo._id ? 'danger' : 'primary'}
                        onClick={() => handleSelectCard(profInfo._id)}
                      >
                        {selectedCard === profInfo._id ? 'Un-wishlist' : 'Wishlist'}
                      </Button>
                    </Card.Footer>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};
export default ListCatalogUser;
