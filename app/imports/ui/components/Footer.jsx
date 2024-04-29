import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto py-3 navbar-custom">
    <Container className="d-flex justify-content-center align-items-center">
      <Card className="site-footer-plate" style={{ minWidth: '1000px', maxWidth: '1000px' }}>
        <Col className="text-center greentxt green-highlight">
          <Card.Header>
            <Row>
              <Col>
                About Us
              </Col>
              <Col>
                Rainbow Cards Team
              </Col>
              <Col>
                Resources
              </Col>
            </Row>
          </Card.Header>
          <Row>
            <Col>
              <a href="https://manoa.hawaii.edu/">
                University of Hawaii at Mānoa
              </a>
              <br />
              Honolulu, HI 96822
              {' '}
              <br />
              ICS 314, Spring 2024
            </Col>
            <Col>
              <Row>
                <Col className="footer-column-gap">
                  Daevin Bagcal<br />
                  Benjamin Bercasio<br />
                  Yuzuki Fujimoto
                </Col>
                <Col className="footer-column-gap">
                  Elijah Saloma<br />
                  John Serraon
                </Col>
              </Row>
            </Col>
            <Col className="footer-column-gap">
              <a href="https://rainbow-cards.github.io/">
                Project Homepage
              </a>
              <br />
              <a href="https://github.com/rainbow-cards">
                GitHub Organization
              </a>
              <br />
              <a href="https://courses.ics.hawaii.edu/ics314s24/index.html">
                Course Website
              </a>
              <br />
            </Col>
          </Row>
        </Col>
      </Card>
    </Container>
  </footer>

);

export default Footer;
