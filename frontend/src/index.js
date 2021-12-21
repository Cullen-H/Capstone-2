import React from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter, Switch } from 'react-router-dom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import PublicRoute from './hooks/PublicRoute';
import PrivateRoute from './hooks/PrivateRoute';
import Login from './components/auth/Login';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer, { AUTH_USER } from './reducers';
import io from 'socket.io-client';
import { getAuth } from './helpers';
import './index.css';
import App from './App';
import { socketServerUrl } from './config';

const store = createStore(reducer);

const token = localStorage.getItem('chatToken');

if (token) {
  store.dispatch({
    type: AUTH_USER,
    payload: {
      socket: io(socketServerUrl, getAuth())
    }
  })
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <PublicRoute exact path='/login'>
            <Login />
          </PublicRoute>
          <PrivateRoute exact path='/dashboard'>
            <App />
          </PrivateRoute>
          <Route exact path='/'>
            <Redirect to='/login' />
          </Route>
        </Switch>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
