import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers';
import App from './App';

function renderWithRedux(component, { initialState, store=createStore(reducer, initialState) } = {}) {
  return {
    ...render(<Provider store={store}>{component}</Provider>)
  };
}

test('renders the app component', () => {
  const { getByTestId } = renderWithRedux(<App />);
  const containerElement = screen.getByTestId(/app-div/i);
  expect(containerElement).toBeInTheDocument();
});
