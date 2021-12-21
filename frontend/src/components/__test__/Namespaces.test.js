import { render, screen } from '@testing-library/react';
import Namespaces from '../Namespaces';

test('renders the namespaces container', () => {
  const { queryByTestId } = render(<Namespaces namespaces={[]} setNsActive={{}} nsActive={null} setNsToCreate={{}} setNsToJoin={{}} />);
  const namespacesElement = screen.getByTestId(/namespaces-container/i);
  expect(namespacesElement).toBeInTheDocument();
});
