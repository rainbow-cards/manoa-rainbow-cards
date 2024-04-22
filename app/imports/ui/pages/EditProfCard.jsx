import React from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import { ProfCards } from '../../api/profcard/ProfCard';

const bridge = new SimpleSchema2Bridge(ProfCards.schema);

/* Renders the EditStuff page for editing a single document. */
const EditProfCard = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  // console.log('EditStuff', _id);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { doc, ready } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe('cards.public');
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const document = ProfCards.collection.findOne(_id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [_id]);
  // console.log('EditStuff', doc, ready);
  // On successful submit, insert the data.
  const submit = (data) => {
    const { name, course, semester, department, email, image, facts, campusEats, hiddenTalent } = data;
    ProfCards.collection.update(_id, { $set: { name, course, semester, department, email, image, facts, campusEats, hiddenTalent } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Card updated successfully', 'success')));
  };

  return ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center"><h2>Edit Card</h2></Col>
          <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
            <Card>
              <Card.Body>
                <TextField id="name" name="name" />
                <TextField id="course" name="course" />
                <TextField id="semester" name="semester" />
                <TextField id="department" name="department" />
                <TextField id="email" name="email" />
                <TextField id="image" name="image" />
                <LongTextField id="facts" name="facts" />
                <TextField id="campuseats" name="campusEats" />
                <TextField id="hiddentalent" name="hiddenTalent" />
                <SubmitField id="edit-submit" value="Submit" />
                <ErrorsField />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default EditProfCard;
