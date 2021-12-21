import { render, screen } from '@testing-library/react';
import ServerDashboard from '../ServerDashboard';

test('renders the dashboard', () => {
  const { queryByTestId } = render(<ServerDashboard 
    nsActive={null}
    rooms={[]}
    setRoomActive={{}}
    messages={[]} 
    setMessageToSend={{}} 
    roomActive={null} 
    setRoomToCreate={{}}
    />);
  const dashboardElement = screen.getByTestId(/server-dashboard-container/i);
  expect(dashboardElement).toBeInTheDocument();
});

test('displays the chat component', () => {
  const { queryByTestId } = render(<ServerDashboard 
    nsActive={null}
    rooms={[]}
    setRoomActive={{}}
    messages={[]} 
    setMessageToSend={{}} 
    roomActive={null} 
    setRoomToCreate={{}}
    />);
  const chatElement = screen.getByTestId(/chat-container/i);
  expect(chatElement).toBeInTheDocument();
});
