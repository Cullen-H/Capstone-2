import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function PrivateRoute({ path, children }) {
  console.log('kasdjklasjd');
  
  const token = localStorage.getItem('chatToken');
  console.log('token: ', token);

  if (!token) {
    console.log('redirecting');
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

// TODO: delete garbage

// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// function PrivateRoute({ component: Component, ...rest }) {
//   const authenticated = useSelector(state => state.auth);

//   return (
//     <Route
//       {...rest}
//       component={(props) => authenticated ?
//       <React.StrictMode>
//         <Component {...props} />
//       </React.StrictMode> : <Redirect to={'/'} /> }
//     />
//   );
// }

// export default PrivateRoute;
