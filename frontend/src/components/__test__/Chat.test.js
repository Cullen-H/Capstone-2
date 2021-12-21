import { render, screen } from '@testing-library/react';
import Chat from '../Chat';

test('renders the chat container', () => {
  const { queryByTestId } = render(<Chat messages={[]} setMessageToSend={{}} roomActive={null} />);
  const chatElement = screen.getByTestId(/chat-container/i);
  expect(chatElement).toBeInTheDocument();
});
