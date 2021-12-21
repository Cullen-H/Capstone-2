import { render, screen } from '@testing-library/react';
import Rooms from '../Rooms';

test('renders the rooms container', () => {
  const { queryByTestId } = render(<Rooms nsActive={{}} rooms={[]} setRoomActive={{}} roomActive={null} setRoomToCreate={{}} />);
  const roomsElement = screen.getByTestId(/rooms-container/i);
  expect(roomsElement).toBeInTheDocument();
});
