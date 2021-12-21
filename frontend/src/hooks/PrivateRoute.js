import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/** PrivateRoute.js checks if a user is logged in and 
  * then redirects to the proper route. The check is 
  * performed by looking for an existing chat token.
  * If this token is invalid the App.js component will
  * remove the item from local storage and reurn the user
  * to the login page.
  */

function PrivateRoute({ path, children }) {
  const token = localStorage.getItem('chatToken');

  if (!token) {
    return (
      <Redirect to='/login' />
    );
  }

  return (
    <Route exact path={path}>
      { children }
    </Route>
  );
}

export default PrivateRoute;
