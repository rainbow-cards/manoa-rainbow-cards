import React from 'react';
import { Card, Col, Container, Dropdown, Row } from 'react-bootstrap';
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
});

const bridge = new SimpleSchema2Bridge(formSchema);

/* Renders the AddStuff page for adding a document. */
const AddProfCard = () => {
  const campusEatsOptions = [
    { label: 'Panda Express', value: 'Panda Express' },
    { label: 'L&L', value: 'L&L' },
    { label: 'HOLOHOLO Grill', value: 'HOLOHOLO Grill' },
    { label: 'Lasoon', value: 'Lasoon' },
    { label: 'BA-LE', value: 'BA-LE' },
    { label: 'Starbucks', value: 'Starbucks' },
  ];
  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { name, course, semester, department, email, image, facts, campusEats } = data;
    ProfCards.collection.insert(
      { name, course, semester, department, email, image, facts, campusEats },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
        }
      },
    );
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
                <TextField name="name" />
                <TextField name="course" />
                <TextField name="semester" />
                <TextField name="department" />
                <TextField name="email" />
                <TextField name="image" />
                <LongTextField name="facts" />
                <TextField name="campusEats" />
                <SubmitField value="Submit" />
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
