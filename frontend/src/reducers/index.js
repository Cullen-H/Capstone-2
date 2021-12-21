import { 
  github_client_id,
  github_redirect_uri,
  github_client_secret,
  github_proxy_url,
  socketServerUrl,
} from '../config';

/** A users relevant info is contained within this reducer.
  * Namely, it contains necessary authentication data, 
  * github api data, and the url to the socket server.
  */

export const AUTH_USER = 'auth_user';
export const LOGOUT_USER = 'logout_user';

const initialState = {
  auth: false,
  github_client_id: github_client_id,
  github_redirect_uri: github_redirect_uri,
  github_client_secret: github_client_secret,
  github_proxy_url: github_proxy_url,
  socketServerUrl: socketServerUrl
}

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        auth: true,
        ...action.payload
      }
    case LOGOUT_USER:
      localStorage.removeItem('chatToken');
      localStorage.removeItem('githubUserInfo');
      return {
        auth: false,
      }
  }

  return state;
}
