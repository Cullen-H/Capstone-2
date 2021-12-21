import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from '../../../reducers';
import Login from '../Login';

function renderWithRedux(component, { initialState, store=createStore(reducer, initialState) } = {}) {
  return {
    ...render(<Provider store={store}>{component}</Provider>)
  };
}

test('renders the login component', () => {
  const { getByTestId } = renderWithRedux(<Login />);
  const loginElement = screen.getByTestId(/login-container/i);
  expect(loginElement).toBeInTheDocument();
});
