import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function PublicRoute({ path, children }) {
  const token = localStorage.getItem('chatToken');

  if (token) {
    console.log('redirecting from public route: ', window.location.href);
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

// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// function PublicRoute({ component: Component, ...rest }) {
//   const authenticated = useSelector(state => state.auth);

//   return (
//     <Route
//       {...rest}
//       component={props => authenticated ?
//       <Redirect to={'/dashboard'} /> : <Component {...props} />}
//     />
//   )
// }

// export default PublicRoute;
