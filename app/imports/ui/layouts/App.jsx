import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import NotFound from '../pages/NotFound';
import SignUp from '../pages/SignUp';
import SignOut from '../pages/SignOut';
import NavBar from '../components/NavBar';
import SignIn from '../pages/SignIn';
import NotAuthorized from '../pages/NotAuthorized';
import LoadingSpinner from '../components/LoadingSpinner';
import ListMyCards from '../pages/ListMyCards';
import ListCatalog from '../pages/ListCatalog';
import AddProfCard from '../pages/AddProfCard';
import EditProfCard from '../pages/EditProfCard';
import ListCatalogAdmin from '../pages/ListCatalogAdmin';
import ListCatalogProf from '../pages/ListCatalogProf';
import DevTest from '../pages/DevTest';
import ListMyWishedCards from '../pages/ListMyWishedCards';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
const App = () => {
  const { ready } = useTracker(() => {
    const rdy = Roles.subscription.ready();
    return {
      ready: rdy,
    };
  });
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="/catalog" element={<ListCatalog />} />
          <Route path="/home" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
          <Route path="/list" element={<ProtectedRoute><ListMyCards /></ProtectedRoute>} />
          <Route path="/wish" element={<ProtectedRoute><ListMyWishedCards /></ProtectedRoute>} />
          <Route path="/profcat" element={<ProfProtectedRoute ready={ready}><ListCatalogProf /></ProfProtectedRoute>} />
          <Route path="/add" element={<AdminProtectedRoute ready={ready}><AddProfCard /></AdminProtectedRoute>} />
          <Route path="/admin" element={<AdminProtectedRoute ready={ready}><ListCatalogAdmin /></AdminProtectedRoute>} />
          <Route path="/edit/:_id" element={<AdProfProtectedRoute ready={ready}><EditProfCard /></AdProfProtectedRoute>} />
          <Route path="/devtest" element={<AdminProtectedRoute ready={ready}><DevTest /></AdminProtectedRoute>} />
          <Route path="/notauthorized" element={<NotAuthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

/*
 * ProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ children }) => {
  const isLogged = Meteor.userId() !== null;
  return isLogged ? children : <Navigate to="/" />;
};

/**
 * AdminProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ ready, children }) => {
  const isLogged = Meteor.userId() !== null;
  if (!isLogged) {
    return <Navigate to="/" />;
  }
  if (!ready) {
    return <LoadingSpinner />;
  }
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  return (isLogged && isAdmin) ? children : <Navigate to="/home" />;
};

const ProfProtectedRoute = ({ ready, children }) => {
  const isLogged = Meteor.userId() !== null;
  if (!isLogged) {
    return <Navigate to="/" />;
  }
  if (!ready) {
    return <LoadingSpinner />;
  }
  const isProf = Roles.userIsInRole(Meteor.userId(), 'professor');
  return (isLogged && isProf) ? children : <Navigate to="/home" />;
};

const AdProfProtectedRoute = ({ ready, children }) => {
  const isLogged = Meteor.userId() !== null;
  if (!isLogged) {
    return <Navigate to="/signin" />;
  }
  if (!ready) {
    return <LoadingSpinner />;
  }
  const isProf = Roles.userIsInRole(Meteor.userId(), 'professor');
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  return (isLogged && (isProf || isAdmin)) ? children : <Navigate to="/home" />;
};

// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

ProtectedRoute.defaultProps = {
  children: <Landing />,
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdminProtectedRoute.propTypes = {
  ready: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

AdminProtectedRoute.defaultProps = {
  ready: false,
  children: <Landing />,
};

// Require a component and location to be passed to each AdminProtectedRoute.
ProfProtectedRoute.propTypes = {
  ready: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

ProfProtectedRoute.defaultProps = {
  ready: false,
  children: <Landing />,
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdProfProtectedRoute.propTypes = {
  ready: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

AdProfProtectedRoute.defaultProps = {
  ready: false,
  children: <Landing />,
};

export default App;
