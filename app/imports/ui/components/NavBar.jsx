import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { Button, Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';

const NavBar = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
  }), []);

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand className="logo-button" as={NavLink} to="/home">
          <Image src="/images/rainbow-cards-logo.png" width="97" height="68" className="logo-outline d-inline-block align-top" alt="Rainbow Cards Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start">
            {currentUser ? ([
              <Button key="catalog" id="catalog-nav" className="nav-text nav-btn red-button" as={NavLink} to="/catalog">
                RAINBOW CATALOG
              </Button>,
              <Button key="list" id="portfolio-nav" className="nav-text nav-btn orange-button" as={NavLink} to="/list">
                PORTFOLIO
              </Button>,
              <Button key="wish" id="wish-nav" className="nav-text nav-btn yellow-button" as={NavLink} to="/wish">
                WISHLIST
              </Button>,
              <Button key="trading" className="nav-text nav-btn green-button" as={NavLink} to="/trading">
                TRADING
              </Button>,
              <Button key="search" id="search-nav" className="nav-text nav-btn blue-button" as={NavLink} to="/search">
                USER SEARCH
              </Button>,
              <Button key="explore" className="nav-text nav-btn indigo-button" as={NavLink} to="/search">
                EXPLORE
              </Button>,
              <Button key="guide" id="guide-nav" className="nav-text nav-btn violet-button" as={NavLink} to="/guide">
                GUIDE
              </Button>,
            ]) : ''}
            {Roles.userIsInRole(Meteor.userId(), 'admin') ? ([
              <Button key="add" id="add-card-admin-nav" className="nav-text nav-btn violet-button" as={NavLink} to="/add">
                ADD NEW CARD
              </Button>,
              <Button key="admin" id="catalog-admin-nav" className="nav-text nav-btn black-button" as={NavLink} to="/admin">
                ADMIN
              </Button>,
            ]) : ''}
            {Roles.userIsInRole(Meteor.userId(), 'professor') ? ([
              <Button key="profcat" className="nav-text nav-btn black-button" as={NavLink} to="/profcat">
                MY CARDS
              </Button>,
            ]) : ''}
          </Nav>
          <Nav className="justify-content-end">
            {currentUser === '' ? (
              <NavDropdown key="login-dropdown" className="greentxt user-dropdown-button" id="login-dropdown" title="Login">
                <NavDropdown.Item id="login-dropdown-sign-in" as={NavLink} to="/signin" key="login">
                  <div className="greentxt">
                    <PersonFill />
                    Sign In
                  </div>
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-up" as={NavLink} to="/signup" key="signup">
                  <div className="greentxt">
                    <PersonPlusFill />
                    Sign Up
                  </div>
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown key="signout" id="navbar-current-user" className="greentxt user-dropdown-button" title={currentUser}>
                <NavDropdown.Item id="navbar-sign-out" className="greentxt" as={NavLink} to="/signout">
                  <BoxArrowRight />
                  {' '}
                  Sign out
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
