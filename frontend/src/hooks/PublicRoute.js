import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/** PublicRoute.js allows a user to access any routes
  * that do not require a user to be logged in. If a 
  * user is logged in they will be redirected to their
  * dashboard.
  */

function PublicRoute({ path, children }) {
  const token = localStorage.getItem('chatToken');

  if (token) {
    return(
      <Redirect to='/dashboard' />
    );
  }

  return (
    <Route exact path={path}>
      { children }
    </Route>
  );
}

export default PublicRoute;
