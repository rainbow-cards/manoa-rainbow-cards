import React from 'react';
import { Col, Container } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto py-3 bg-success-subtle">
    <Container>
      <Col className="text-center greentxt">
        Mānoa Rainbow Cards
        {' '}
        <br />
        University of Hawaii
        <br />
        Honolulu, HI 96822
        {' '}
        <br />
        <a href="https://rainbow-cards.github.io/">
          Project Homepage
        </a>
      </Col>
    </Container>
  </footer>
);

export default Footer;
