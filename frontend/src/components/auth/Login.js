import React, { useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { getAuth } from '../../helpers';
import { AUTH_USER } from '../../reducers';
import GithubIcon from 'mdi-react/GithubIcon';

/** Login.js handles github oAuthentication.
  * Upon successfully redirecting and receiving a code from github,
  * this code is sent to the backend and authentication is handled there.
  * The frontend then receives a token that can be stored and used when
  * communicating with the socket server. The logged in user is then redirected 
  * to the dashboard.
  */

function Login() {
  const github_client_id = useSelector(state => state.github_client_id);
  const github_redirect_uri = useSelector(state => state.github_redirect_uri);
  const github_proxy_url = useSelector(state => state.github_proxy_url);
  const socketServerUrl = useSelector(state => state.socketServerUrl);
  const dispatch = useDispatch();
  const history = useHistory();

  const [authError, setAuthError] = useState(null);

  let auth = useSelector(state => state.auth)

  useEffect(async () => {
    const url = window.location.href;

    if (url.includes('?code=')) {
      const newUrl = url.split('?code=');
      window.history.pushState({}, null, newUrl[0]);
      
      const requestData = {
        code: newUrl[1]
      };
      try {
        const res = await axios.post(github_proxy_url, requestData);
        localStorage.setItem('chatToken', res.data.token);
        localStorage.setItem('githubUserInfo', JSON.stringify(res.data.github_user_info));
        dispatch({
          type: AUTH_USER,
          payload: {
            socket: io(socketServerUrl, getAuth())
          }
        });
        console.log('authorized');
        if (authError !== null) setAuthError(null);
      } catch(err) {
        setAuthError(err.message);
      }
    }
  }, [dispatch, authError]);

  if (useSelector(state => state.auth)) {
    return <Redirect to='/' />
  }

  const isAuthError = () => {
    if (authError) return (
      <span className="alert-error">{ authError }</span>
    );
  }
  
  return (
    <div className="login">
      <h1 className="login-title">COLLABORATOR</h1>
      {isAuthError()}
      <div className="login-container">
        <a
          className="login-button"
          href={`https://github.com/login/oauth/authorize?scope=user&client_id=${github_client_id}&redirect_uri=${github_redirect_uri}`}
        >
          <GithubIcon />
          <span>Login with GitHub</span>
        </a>
      </div>
    </div>
  );
}

export default Login;
