import React from 'react';
import swal from 'sweetalert';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import { ProfCards } from '../../api/profcard/ProfCard';

const bridge = new SimpleSchema2Bridge(ProfCards.schema);

/* Renders the EditStuff page for editing a single document. */
const DeleteProfCard = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  // console.log('EditStuff', _id);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe('cards.public');
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    return {
      ready: rdy,
    };
  }, [_id]);
  // console.log('EditStuff', doc, ready);
  // On successful submit, insert the data.
  const submit = () => {
    ProfCards.collection.remove({ _id: _id }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Card deleted successfully', 'success')));
  };

  return ready ? (
    <Container className="py-3 text-center">
      <Row className="justify-content-center">
        <Col xs={4} className="top-50">
          <Col className="text-center greentxt"><h2>Are you sure you want to delete the Card?</h2></Col>
          <Button onClick={submit()}>Yes</Button>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default DeleteProfCard;
