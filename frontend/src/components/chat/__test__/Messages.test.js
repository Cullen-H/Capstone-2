import { render, screen } from '@testing-library/react';
import Messages from '../Messages';

test('renders the messages component', () => {
  const { queryByTestId } = render(<Messages messages={[]} />);
  const messagesElement = screen.getByTestId(/messages-container/i);
  expect(messagesElement).toBeInTheDocument();
});
