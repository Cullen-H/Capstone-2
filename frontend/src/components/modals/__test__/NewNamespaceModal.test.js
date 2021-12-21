import { render, screen } from '@testing-library/react';
import NewNamespaceModal from '../NewNamespaceModal';

test('renders the modal component', () => {
  const { queryByTestId } = render(<NewNamespaceModal 
      setNewNsModalActive={{}}
      setNsToCreate={{}}
      setNsToJoin={{}}
    />);
  const modalElement = screen.getByTestId(/modal-container/i);
  expect(modalElement).toBeInTheDocument();
});
