import React from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, HiddenField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import { ProfCards } from '../../api/profcard/ProfCard';

import { Link } from 'react-router-dom';

const bridge = new SimpleSchema2Bridge(ProfCards.schema);

/* Renders the EditStuff page for editing a single document. */
const DeleteProfCard = () => {
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
    ProfCards.collection.remove(_id, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Card deleted successfully', 'success')));
  };

  return ready ? (
    <Container className="py-3 text-center">
      <Row className="justify-content-center">
        <Col xs={4} className="top-50">
          <Col className="text-center greentxt"><h2>Are you sure you want to delete the Card?</h2></Col>
          <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
            <Card>
              <Card.Body className="bg-success-subtle greentxt">
                <HiddenField id="name" name="name"/>
                <HiddenField id="course" name="course"/>
                <HiddenField id="semester" name="semester"/>
                <HiddenField id="department" name="department"/>
                <HiddenField id="email" name="email"/>
                <HiddenField id="image" name="image"/>
                <HiddenField id="facts" name="facts"/>
                <HiddenField id="campuseats" name="campusEats"/>
                <HiddenField id="hiddentalent" name="hiddenTalent"/>
                {/*<div style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>*/}
                  <SubmitField id="delete-submit" value="Yes!!!" to={`/admin`}/>
                  {/*<button type="button" className="btn btn-danger" id="delete-decline" value="Nah" to={`/admin`}>Nah</button>*/}
                  {/*<Link id="delete-decline" to={`/admin`}>
                    <Button variant="danger">Nah</Button>
                  </Link>*/}
                {/*}</div>*/}

                <ErrorsField/>
                <HiddenField name="owners"/>
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner/>;
};

export default DeleteProfCard;
