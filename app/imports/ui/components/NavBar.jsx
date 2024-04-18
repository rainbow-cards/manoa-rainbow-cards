import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';

const NavBar = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
  }), []);

  return (
    <Navbar bg="success-subtle" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <Image src="/images/rainbow-cards-logo.png" width="97" height="68" className="d-inline-block align-top" alt="Rainbow Cards Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start">
            {currentUser ? ([
              <Nav.Link id="catalog-nav" as={NavLink} to="/catalog" key="catalog">Catalog</Nav.Link>,
              <Nav.Link id="list-user-cards-nav" as={NavLink} to="/list" key="list">My Cards</Nav.Link>,
            ]) : ''}
            {Roles.userIsInRole(Meteor.userId(), 'admin') ? ([
              <Nav.Link id="add-card-admin-nav" as={NavLink} to="/add" key="add">Add</Nav.Link>,
              <Nav.Link id="catalog-admin-nav" as={NavLink} to="/admin" key="admin">Admin</Nav.Link>,
              <Nav.Link id="devtest-admin-nav" as={NavLink} to="/devtest" key="devtest">DevTest</Nav.Link>,
            ]) : ''}
          </Nav>
          <Nav className="justify-content-end">
            {currentUser === '' ? (
              <NavDropdown className="greentxt" id="login-dropdown" title="Login">
                <NavDropdown.Item id="login-dropdown-sign-in" as={NavLink} to="/signin">
                  <div className="greentxt">
                    <PersonFill />
                    Sign In
                  </div>
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-up" as={NavLink} to="/signup">
                  <div className="greentxt">
                    <PersonPlusFill />
                    Sign Up
                  </div>
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="navbar-current-user" title={currentUser}>
                <NavDropdown.Item id="navbar-sign-out" as={NavLink} to="/signout">
                  <BoxArrowRight />
                  {' '}
                  Sign
                  out
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
