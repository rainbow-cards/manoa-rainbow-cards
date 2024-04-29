import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { ProfCards } from '../../api/profcard/ProfCard';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  name: String,
  course: String,
  semester: String,
  department: String,
  email: String,
  image: String,
  facts: String,
  campusEats: String,
  hiddenTalent: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/* Renders the AddStuff page for adding a document. */
const AddProfCard = () => {
  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { name, course, semester, department, email, image, facts, campusEats, hiddenTalent } = data;
    const owners = [{ name: email, count: 1 }];
    if (ProfCards.collection.find({ name: name, course: course, semester: semester }) === undefined) {
      ProfCards.collection.insert(
        { name, course, semester, department, email, image, facts, owners, campusEats, hiddenTalent },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Item added successfully', 'success');
            formRef.reset();
          }
        },
      );
    } else {
      swal('Error', 'Card for this course already exists', 'error');
    }
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={7}>
          <Col className="text-center"><h2>Add Professor Card</h2></Col>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Card>
              <Card.Body>
                <Row className="justify-content-center">
                  <Col xs={6}>
                    <TextField id="name" name="name" />
                  </Col>
                  <Col>
                    <TextField id="course" name="course" />
                  </Col>
                  <Col>
                    <TextField id="semester" name="semester" />
                  </Col>
                </Row>
                <Row className="justify-content-center">
                  <Col xs={2}>
                    <TextField id="department" name="department" />
                  </Col>
                  <Col>
                    <TextField id="email" name="email" />
                  </Col>
                </Row>
                <TextField id="image" name="image" />
                <LongTextField id="facts" name="facts" />
                <TextField id="campuseats" name="campusEats" />
                <TextField id="hiddentalent" name="hiddenTalent" />
                <SubmitField id="add-submit" value="Submit" />
                <ErrorsField />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProfCard;
