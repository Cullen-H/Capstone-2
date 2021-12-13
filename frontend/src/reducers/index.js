import { 
  github_client_id,
  github_redirect_uri,
  github_client_secret,
  github_proxy_url,
  socketServerUrl,
} from '../config';

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
    // TODO: may need to remove github user as well. I'm unsure.
    case LOGOUT_USER:
      localStorage.removeItem('chatToken');
      localStorage.removeItem('githubUserInfo');
      // TODO: user may not be necessary here or in intial state. May also want to save to localstorage
      return {
        auth: false,
      }
  }

  return state;
}
