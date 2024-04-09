import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <Container id="landing-page" fluid className="py-3">
    <Row className="align-middle text-center">

      <Col xs={4}>
        <Image roundedCircle src="/images/rainbow-cards-icon.png" width="200px" />
      </Col>

      <Col className="d-flex flex-column justify-content-center greentxt">
        <h1>Mānoa Rainbow Cards</h1>
        {/* eslint-disable-next-line max-len */}
        <p>Rainbow Cards is a card collection site where you can collect the cards of your favorite professors. Each card includes information and fun facts about the professor. Aim to collect a variety of cards and trade them for your desired cards with other users!
        </p>
      </Col>

      <Col xs={4}>
        <Image roundedCircle src="/images/rainbow-cards-icon.png" width="200px" />
      </Col>
    </Row>

    <Row className="align-middle text-center">
      <Col className="d-flex flex-column justify-content-center greentxt">
        <h2> Featured Cards: </h2>
      </Col>
    </Row>

    <Row className="align-middle text-center">
      <Col className="d-flex justify-content-center">
        <Image src="/images/rc-landing-featured.png" width="1000px" />
      </Col>
    </Row>
  </Container>
);

export default Landing;
